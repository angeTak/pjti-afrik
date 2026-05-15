import React, { useState } from 'react';
import { Mail, Trash2, CheckCircle2, Clock, XCircle, Eye, EyeOff } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAdmin, PartnershipRequest } from '@/context/AdminContext';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/ConfirmModal';

const statusConfig = {
  new: { label: 'Nouveau', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
  contacted: { label: 'Contacté', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Mail },
  accepted: { label: 'Accepté', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 },
  rejected: { label: 'Refusé', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

const AdminPartnershipRequests = () => {
  const { partnershipRequests, updatePartnershipRequestStatus, deletePartnershipRequest } = useAdmin();
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: PartnershipRequest['status']) => {
    try {
      await updatePartnershipRequestStatus(id, newStatus);
      toast.success('Statut mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const confirmDelete = async () => {
    if (requestToDelete) {
      try {
        await deletePartnershipRequest(requestToDelete);
        toast.error('Demande de partenariat supprimée');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      } finally {
        setRequestToDelete(null);
      }
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedRequestId(expandedRequestId === id ? null : id);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Demandes de partenariat</h1>
          <p className="text-slate-500">Gérez les demandes de partenariat reçues via le formulaire du site</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Mobile View: Card List */}
        <div className="md:hidden divide-y divide-slate-100">
          {partnershipRequests.length === 0 ? (
            <div className="py-12 px-6 text-center text-slate-500">
              <Mail className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              Aucune demande de partenariat pour le moment.
            </div>
          ) : (
            partnershipRequests.map((request) => {
              const isExpanded = expandedRequestId === request.id;
              const config = statusConfig[request.status];
              return (
                <div key={request.id} className={`p-4 space-y-4 ${isExpanded ? 'bg-slate-50' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        {new Date(request.created_at).toLocaleDateString('fr-FR')}
                      </p>
                      <h3 className="font-black text-slate-900">{request.organization_name}</h3>
                      <p className="text-xs font-bold text-purple-600 uppercase tracking-wide">{request.partnership_type}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleExpand(request.id)}
                        className="p-2 text-purple-600 bg-purple-50 rounded-xl"
                      >
                        {isExpanded ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => setRequestToDelete(request.id)}
                        className="p-2 text-red-600 bg-red-50 rounded-xl"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <p className="text-slate-600 font-medium flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {request.email}
                    </p>
                    <p className="text-slate-600 font-medium flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {request.sector}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <select
                      value={request.status}
                      onChange={(e) => handleStatusChange(request.id, e.target.value as PartnershipRequest['status'])}
                      className={`text-[10px] font-black px-4 py-2 rounded-xl border-none outline-none cursor-pointer uppercase tracking-wider ${config?.color}`}
                    >
                      <option value="new">Nouveau</option>
                      <option value="contacted">Contacté</option>
                      <option value="accepted">Accepté</option>
                      <option value="rejected">Refusé</option>
                    </select>
                  </div>

                  {isExpanded && (
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap animate-in fade-in slide-in-from-top-2">
                      <span className="font-black block mb-2 text-slate-900 uppercase text-[10px] tracking-widest">Message :</span>
                      {request.message}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Date</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Organisation</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Secteur d'activité</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Type</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Statut</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {partnershipRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Mail className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    Aucune demande de partenariat pour le moment.
                  </td>
                </tr>
              ) : (
                partnershipRequests.map((request) => {
                  const isExpanded = expandedRequestId === request.id;
                  const config = statusConfig[request.status];
                  return (
                    <React.Fragment key={request.id}>
                      <tr className={`hover:bg-slate-50 transition-colors ${isExpanded ? 'bg-slate-50' : ''}`}>
                        <td className="py-4 px-6 text-sm text-slate-600 whitespace-nowrap">
                          {new Date(request.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-slate-900">
                          {request.organization_name}
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600">
                          <div>{request.sector}</div>
                          <div className="text-xs text-slate-400">{request.email}</div>
                          {request.phone && <div className="text-xs text-slate-400">{request.phone}</div>}
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600 capitalize">
                          {request.partnership_type}
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={request.status}
                            onChange={(e) => handleStatusChange(request.id, e.target.value as PartnershipRequest['status'])}
                            className={`text-xs font-bold px-3 py-1 rounded-full border outline-none cursor-pointer appearance-none ${config?.color}`}
                            style={{ backgroundImage: 'none' }}
                          >
                            <option value="new">Nouveau</option>
                            <option value="contacted">Contacté</option>
                            <option value="accepted">Accepté</option>
                            <option value="rejected">Refusé</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => toggleExpand(request.id)}
                            className="p-2 text-slate-400 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50"
                            title={isExpanded ? "Masquer le message" : "Voir le message"}
                          >
                            {isExpanded ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => setRequestToDelete(request.id)}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                            title="Supprimer la demande"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-slate-50">
                          <td colSpan={6} className="py-4 px-6 border-t border-slate-100">
                            <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap">
                              <span className="font-semibold block mb-2 text-slate-900">Message :</span>
                              {request.message}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!requestToDelete}
        onClose={() => setRequestToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer cette demande ?"
        description="Cette demande de partenariat sera définitivement supprimée. Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </AdminLayout>
  );
};

export default AdminPartnershipRequests;
