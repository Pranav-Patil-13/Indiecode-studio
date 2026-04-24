import { Box, Paper, Typography, Stack, Divider, useTheme, Chip, IconButton, Button } from '@mui/material';
import { Circle, CheckCircle2, Clock, Calendar, Plus, Trash2, ChevronRight, Edit2, Receipt } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useState, useEffect, useRef } from 'react';
import QuickPromptModal from '../../Modals/QuickPromptModal';
import ConfirmDialog from '../../Modals/ConfirmDialog';
import InvoiceModal from '../../Modals/InvoiceModal';
import { Reorder, motion } from 'framer-motion';

const RoadmapItem = ({ title, date, status, color, isLast, onToggle, onDelete, onEdit, paymentStatus, onInvoice, approvalStatus, onRequestApproval, onApprove, isClientView }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', gap: { xs: 2, sm: 4 } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box 
          onClick={onToggle}
          sx={{ 
            p: 0.8, 
            borderRadius: '50%', 
            bgcolor: (status === 'Done' || status === 'In Progress') ? `${color}15` : 'rgba(0,0,0,0.03)',
            color: (status === 'Done' || status === 'In Progress') ? color : 'text.disabled',
            border: '2px solid',
            borderColor: 'background.paper',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            zIndex: 1,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'scale(1.1)' }
          }}
        >
          {status === 'Done' ? <CheckCircle2 size={24} /> : <Circle size={24} fill={status === 'In Progress' ? color : 'white'} />}
        </Box>
        {!isLast && <Box sx={{ width: 3, flexGrow: 1, bgcolor: 'divider', my: 1, borderRadius: 1.5 }} />}
      </Box>
      <Box sx={{ pb: isLast ? 0 : 6, flexGrow: 1 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            borderRadius: 4, 
            border: '1px solid',
            borderColor: 'divider',
            borderLeft: `4px solid ${status === 'Upcoming' ? 'rgba(0,0,0,0.1)' : color}`,
            bgcolor: status === 'In Progress' ? `${color}10` : status === 'Done' ? 'rgba(0,0,0,0.01)' : 'background.paper',
            boxShadow: status === 'In Progress' ? `0 10px 30px ${color}20` : '0 4px 12px rgba(0,0,0,0.02)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            opacity: 1,
            borderStyle: status === 'Upcoming' ? 'dashed' : 'solid',
            cursor: 'grab',
            '&:active': { cursor: 'grabbing' },
            '&:hover': {
              transform: { md: 'translateX(8px)', xs: 'none' },
              boxShadow: status === 'In Progress' ? `0 15px 40px ${color}30` : '0 15px 35px rgba(0,0,0,0.06)',
              '& .action-btns': { opacity: 1 }
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
            <Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 1, 
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  color: status === 'Done' ? 'text.secondary' : 'text.primary',
                  textDecoration: status === 'Done' ? 'line-through' : 'none',
                  opacity: status === 'Done' ? 0.7 : 1
                }}
              >
                {title}
              </Typography>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: 'wrap', gap: 1 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: 'text.secondary' }}>
                  <Calendar size={14} />
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>{date}</Typography>
                </Stack>
                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.1)', display: { xs: 'none', sm: 'block' } }} />
                <Chip 
                  label={status} 
                  size="small"
                  onClick={onToggle}
                  sx={{ 
                    height: 20, 
                    fontSize: '0.6rem', 
                    fontWeight: 600, 
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    bgcolor: status === 'Done' ? '#10b98120' : status === 'In Progress' ? `${color}20` : 'rgba(0,0,0,0.05)',
                    color: status === 'Done' ? '#10b981' : status === 'In Progress' ? color : 'text.disabled',
                    border: '1px solid',
                  }}
                />
                {paymentStatus && (
                  <Chip 
                    label={paymentStatus} 
                    size="small"
                    variant="outlined"
                    sx={{ 
                      height: 20, 
                      fontSize: '0.6rem', 
                      fontWeight: 600, 
                      textTransform: 'uppercase',
                      borderColor: paymentStatus === 'Paid' ? '#10b98140' : '#f59e0b40',
                      color: paymentStatus === 'Paid' ? '#10b981' : '#f59e0b'
                    }}
                  />
                )}
                {approvalStatus && (
                  <Chip 
                    label={approvalStatus} 
                    size="small"
                    variant="outlined"
                    sx={{ 
                      height: 20, 
                      fontSize: '0.6rem', 
                      fontWeight: 600, 
                      textTransform: 'uppercase',
                      borderColor: approvalStatus === 'Approved' ? '#10b98140' : '#3b82f640',
                      color: approvalStatus === 'Approved' ? '#10b981' : '#3b82f6',
                      bgcolor: approvalStatus === 'Approved' ? '#10b98110' : '#3b82f610'
                    }}
                  />
                )}
              </Stack>
            </Box>
            <Stack direction="row" spacing={0.5} className="action-btns" sx={{ opacity: { xs: 1, md: 0 }, transition: 'opacity 0.2s ease', ml: { xs: -1, sm: 0 } }}>
              {status === 'Done' && !approvalStatus && !isClientView && (
                <Button 
                  size="small" 
                  variant="contained" 
                  onClick={onRequestApproval}
                  sx={{ py: 0, fontSize: '0.65rem', height: 24, borderRadius: 1.5 }}
                >
                  Request Approval
                </Button>
              )}
              {approvalStatus === 'Pending Approval' && isClientView && (
                <Button 
                  size="small" 
                  variant="contained" 
                  color="success"
                  onClick={onApprove}
                  sx={{ py: 0, fontSize: '0.65rem', height: 24, borderRadius: 1.5 }}
                >
                  Approve
                </Button>
              )}
              {status === 'Done' && !paymentStatus && !isClientView && (
                <IconButton 
                  size="small" 
                  onClick={onInvoice}
                  sx={{ color: 'text.disabled', '&:hover': { color: 'success.main', bgcolor: 'success.lighter' } }}
                >
                  <Receipt size={16} />
                </IconButton>
              )}
              <IconButton 
                size="small" 
                onClick={onEdit}
                sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main', bgcolor: 'primary.lighter' } }}
              >
                <Edit2 size={16} />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={onDelete}
                sx={{ color: 'text.disabled', '&:hover': { color: 'error.main', bgcolor: 'error.lighter' } }}
              >
                <Trash2 size={16} />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

const ProjectRoadmap = ({ project, isClientView = false }) => {
  const theme = useTheme();
  const { updateProject, requestApproval, approveMilestone, updateProjectPhases } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  
  const initialPhases = (project.phases && project.phases.length > 0) ? project.phases : [
    { id: '1', name: 'Frontend', status: 'pending', date: 'TBD', start: 0, width: 25, color: '#3b82f6' },
    { id: '2', name: 'Backend', status: 'pending', date: 'TBD', start: 25, width: 25, color: '#8b5cf6' },
    { id: '3', name: 'Testing', status: 'pending', date: 'TBD', start: 50, width: 25, color: '#f59e0b' },
    { id: '4', name: 'Deploying', status: 'pending', date: 'TBD', start: 75, width: 25, color: '#10b981' }
  ].map((p, i) => ({ ...p, id: p.id || `p-${i}` }));

  const [phases, setPhases] = useState(initialPhases);
  const isReordering = useRef(false);

  // Sync with project updates from context
  useEffect(() => {
    if (!isReordering.current && project.phases && project.phases.length > 0) {
      setPhases(project.phases.map((p, i) => ({ ...p, id: p.id || `p-${i}` })));
    }
  }, [project.phases]);

  const handleReorder = (newPhases) => {
    isReordering.current = true;
    setPhases(newPhases);
    updateProjectPhases(project.id, newPhases);
    
    // Reset the flag after a short delay to allow DB sync to settle
    setTimeout(() => {
      isReordering.current = false;
    }, 500);
  };

  const handleInvoiceMilestone = (idx) => {
    const phase = phases[idx];
    setInvoiceData({
      project,
      items: [{ description: `Milestone: ${phase.name}`, amount: 5000, quantity: 1 }]
    });
    setIsInvoiceModalOpen(true);
  };

  const handleRequestApproval = (idx) => {
    requestApproval(project.id, idx);
  };

  const handleApprove = (idx) => {
    approveMilestone(project.id, idx);
  };

  const mapStatus = (status) => {
    switch (status) {
      case 'completed': return 'Done';
      case 'active': return 'In Progress';
      default: return 'Upcoming';
    }
  };

  const handleToggleStatus = (idx) => {
    const updatedPhases = [...phases];
    const currentStatus = updatedPhases[idx].status;
    const nextStatus = currentStatus === 'completed' ? 'active' : currentStatus === 'active' ? 'pending' : 'completed';
    updatedPhases[idx] = { ...updatedPhases[idx], status: nextStatus };
    updateProjectPhases(project.id, updatedPhases);
  };

  const handleDeletePhase = (idx) => {
    setSelectedPhaseIdx(idx);
    setIsDeleteConfirmOpen(true);
  };

  const handleEditPhase = (idx) => {
    setSelectedPhaseIdx(idx);
    setIsEditModalOpen(true);
  };

  const confirmDelete = () => {
    const updatedPhases = phases.filter((_, i) => i !== selectedPhaseIdx);
    updateProjectPhases(project.id, updatedPhases);
    setIsDeleteConfirmOpen(false);
  };

  const confirmEdit = (name, color) => {
    const updatedPhases = [...phases];
    updatedPhases[selectedPhaseIdx] = { 
      ...updatedPhases[selectedPhaseIdx], 
      name, 
      color 
    };
    updateProjectPhases(project.id, updatedPhases);
    setIsEditModalOpen(false);
  };

  const handleAddPhase = (name, color = '#3b82f6') => {
    const lastPhase = phases[phases.length - 1];
    const start = lastPhase ? (lastPhase.start !== undefined ? lastPhase.start : 0) + (lastPhase.width || 0) : 0;
    const newPhase = { 
      id: crypto.randomUUID(),
      name, 
      status: 'pending', 
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      start,
      width: 20,
      color
    };
    updateProjectPhases(project.id, [...phases, newPhase]);
    setIsAddModalOpen(false);
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 500, letterSpacing: '-0.02em', mb: 0.5 }}>Project Roadmap</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>Reorder milestones by dragging them up or down</Typography>
        </Box>
        {!isClientView && (
          <Button 
            variant="contained" 
            startIcon={<Plus size={18} />} 
            onClick={() => setIsAddModalOpen(true)}
            sx={{ borderRadius: 2.5 }}
          >
            Add Milestone
          </Button>
        )}
      </Box>

      <Box sx={{ maxWidth: 800, mt: 2 }}>
        <Reorder.Group axis="y" values={phases} onReorder={handleReorder} style={{ listStyle: 'none', padding: 0 }}>
          {phases.map((phase, index) => (
            <Reorder.Item key={phase.id || index} value={phase} style={{ marginBottom: '16px' }}>
              <RoadmapItem 
                title={phase.name}
                date={phase.date || 'TBD'}
                status={mapStatus(phase.status)}
                color={phase.color || '#3b82f6'}
                isLast={index === phases.length - 1} 
                onToggle={() => handleToggleStatus(index)}
                onDelete={() => handleDeletePhase(index)}
                onEdit={() => handleEditPhase(index)}
                paymentStatus={phase.paymentStatus}
                onInvoice={() => handleInvoiceMilestone(index)}
                approvalStatus={phase.approvalStatus}
                onRequestApproval={() => handleRequestApproval(index)}
                onApprove={() => handleApprove(index)}
                isClientView={isClientView}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </Box>

      <InvoiceModal 
        open={isInvoiceModalOpen} 
        onClose={() => setIsInvoiceModalOpen(false)} 
        project={project}
        initialItems={invoiceData?.items}
      />

      <QuickPromptModal 
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={(name, color) => handleAddPhase(name, color)}
        showColorPicker={true}
        title="Add Roadmap Milestone"
        label="Milestone Name"
        placeholder="e.g. Beta Version Launch"
      />

      <QuickPromptModal 
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={(name, color) => confirmEdit(name, color)}
        showColorPicker={true}
        initialValue={selectedPhaseIdx !== null ? phases[selectedPhaseIdx]?.name : ''}
        initialColor={selectedPhaseIdx !== null ? phases[selectedPhaseIdx]?.color : '#3b82f6'}
        title="Edit Roadmap Milestone"
        label="Milestone Name"
        placeholder="e.g. Beta Version Launch"
      />

      <ConfirmDialog 
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Milestone"
        message="Are you sure you want to remove this milestone from the project roadmap?"
        confirmText="Remove"
        severity="error"
      />
    </Box>
  );
};

export default ProjectRoadmap;
