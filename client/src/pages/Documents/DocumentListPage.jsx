import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, X, Upload, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import EmptyState from '../../components/common/EmptyState';
import documentService from '../../services/documentService';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import DocumentCard from '../../components/documents/DocumentCard';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload popup state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Delete popup state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchDocuments = useCallback(async () => {
    try {
      const data = await documentService.getDocuments();
      const list = data?.data ?? data;
      if (isMounted.current) {
        setDocuments(Array.isArray(list) ? list : []);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to fetch documents.'));
      console.error(error);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // ---------- Upload ----------
  const closeUploadModal = () => {
    if (uploading) return; // don't close mid-upload
    setIsUploadModalOpen(false);
    setUploadFile(null);
    setUploadTitle('');
    setIsDragging(false);
  };

  const chooseFile = (file) => {
    if (!file) return;

    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      toast.error('Please choose a PDF file.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('The file is too big. PDF must be up to 10MB.');
      return;
    }
    setUploadFile(file);
  };

  const handleFileChange = (e) => {
    chooseFile(e.target.files[0]);
    e.target.value = ''; // allow re-selecting the same file
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    chooseFile(e.dataTransfer.files[0]);
  };

  const handleDragLeave = (e) => {
    // ignore leave events caused by moving over child elements
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadTitle.trim()) {
      toast.error('Please enter a document title.');
      return;
    }
    if (!uploadFile) {
      toast.error('Please choose a PDF file.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', uploadTitle.trim());

    try {
      await documentService.uploadDocument(formData);
      toast.success('Document uploaded successfully!');
      setUploading(false);
      closeUploadModal();
      setLoading(true);
      await fetchDocuments();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to upload document.'));
    } finally {
      if (isMounted.current) setUploading(false);
    }
  };

  // ---------- Delete ----------
  const openDeleteModal = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return; // don't close mid-delete
    setIsDeleteModalOpen(false);
    setSelectedDoc(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;

    const docToDelete = selectedDoc;
    setDeleting(true);
    try {
      await documentService.deleteDocument(docToDelete._id);
      toast.success(`"${docToDelete.title}" deleted.`);
      setDocuments((prev) => prev.filter((doc) => doc._id !== docToDelete._id));
      setDeleting(false);
      closeDeleteModal();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete document.'));
    } finally {
      if (isMounted.current) setDeleting(false);
    }
  };

  // ---------- Page content ----------
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      );
    }

    if (documents.length === 0) {
      return <EmptyState />;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {documents.map((doc) => (
          <DocumentCard key={doc._id} document={doc} onDelete={openDeleteModal} />
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Page title and upload button */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-medium text-slate-900 tracking-tight">
            My Documents
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage and organize your learning materials
          </p>
        </div>

        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Plus size={18} strokeWidth={2.5} />
          Upload Document
        </Button>
      </div>

      {renderContent()}

      {/* Upload popup */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
            <button
              type="button"
              onClick={closeUploadModal}
              disabled={uploading}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-medium text-slate-900">
              Upload New Document
            </h2>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              Add a PDF document to your library
            </p>

            <form onSubmit={handleUpload} className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <label
                  htmlFor="doc-title"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wide"
                >
                  Document Title
                </label>
                <input
                  id="doc-title"
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g., React Interview Prep"
                  className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 focus:outline-none focus:border-emerald-400 focus:bg-white transition-colors duration-200"
                />
              </div>

              {/* File drop area */}
              <div className="space-y-2">
                <label
                  htmlFor="doc-file"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wide"
                >
                  PDF File
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center text-center h-44 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 ${
                    isDragging
                      ? 'border-emerald-400 bg-emerald-50/50'
                      : 'border-slate-200 bg-slate-50/50 hover:border-emerald-300'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
                    <Upload size={22} strokeWidth={2} />
                  </div>

                  {uploadFile ? (
                    <>
                      <p className="text-sm font-medium text-slate-900 px-4 truncate max-w-full">
                        {uploadFile.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Click to choose a different file
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-slate-600">
                        <span className="text-emerald-600 font-medium">
                          Click to upload
                        </span>{' '}
                        or drag and drop
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        PDF up to 10MB
                      </p>
                    </>
                  )}

                  <input
                    id="doc-file"
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    onClick={(e) => e.stopPropagation()} // prevent click bubbling loop
                    className="hidden"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeUploadModal}
                  disabled={uploading}
                  className="h-11 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-200 disabled:opacity-60"
                >
                  Cancel
                </button>
                <Button type="submit" disabled={uploading} className="w-full">
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete popup */}
      {isDeleteModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
            <button
              type="button"
              onClick={closeDeleteModal}
              disabled={deleting}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
              <Trash2 size={22} strokeWidth={2} />
            </div>

            <h2 className="text-xl font-medium text-slate-900">
              Confirm Deletion
            </h2>
            <p className="text-sm text-slate-500 mt-2 mb-6">
              Are you sure you want to delete the document:{' '}
              <span className="font-semibold text-slate-900">
                {selectedDoc.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="h-11 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-200 disabled:opacity-60"
              >
                Cancel
              </button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="w-full"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentListPage;