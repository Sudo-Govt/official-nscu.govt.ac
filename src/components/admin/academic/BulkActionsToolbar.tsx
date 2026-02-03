import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ChevronDown, Trash2, XCircle, DoorOpen, DoorClosed } from 'lucide-react';

export interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: 'default' | 'destructive';
  confirmMessage?: string;
}

interface BulkActionsToolbarProps {
  selectedIds: string[];
  totalItems: number;
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
  actions: BulkAction[];
  onAction: (actionId: string, selectedIds: string[]) => Promise<void>;
  entityName?: string;
}

export function BulkActionsToolbar({
  selectedIds,
  totalItems,
  onSelectAll,
  allSelected,
  actions,
  onAction,
  entityName = 'items',
}: BulkActionsToolbarProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmAction, setConfirmAction] = useState<BulkAction | null>(null);

  const handleAction = async (action: BulkAction) => {
    if (action.confirmMessage || action.variant === 'destructive') {
      setConfirmAction(action);
    } else {
      await executeAction(action);
    }
  };

  const executeAction = async (action: BulkAction) => {
    setIsProcessing(true);
    try {
      await onAction(action.id, selectedIds);
    } finally {
      setIsProcessing(false);
      setConfirmAction(null);
    }
  };

  if (selectedIds.length === 0 && totalItems === 0) return null;

  return (
    <>
      <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg mb-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={allSelected}
            onCheckedChange={(checked) => onSelectAll(checked === true)}
          />
          <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
            Select All
          </label>
        </div>

        {selectedIds.length > 0 && (
          <>
            <span className="text-sm text-muted-foreground">
              {selectedIds.length} of {totalItems} selected
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isProcessing}>
                  Bulk Actions
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {actions.map((action, idx) => (
                  <div key={action.id}>
                    {idx > 0 && action.variant === 'destructive' && <DropdownMenuSeparator />}
                    <DropdownMenuItem
                      onClick={() => handleAction(action)}
                      className={action.variant === 'destructive' ? 'text-destructive' : ''}
                    >
                      {action.icon}
                      <span className="ml-2">{action.label}</span>
                    </DropdownMenuItem>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.confirmMessage || 
                `Are you sure you want to ${confirmAction?.label.toLowerCase()} ${selectedIds.length} ${entityName}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmAction && executeAction(confirmAction)}
              className={confirmAction?.variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              {isProcessing ? 'Processing...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Pre-defined actions for academic entities
export const COURSE_BULK_ACTIONS: BulkAction[] = [
  {
    id: 'admission_open',
    label: 'Open Admissions',
    icon: <DoorOpen className="h-4 w-4" />,
  },
  {
    id: 'admission_closed',
    label: 'Close Admissions',
    icon: <DoorClosed className="h-4 w-4" />,
  },
  {
    id: 'discontinue',
    label: 'Discontinue',
    icon: <XCircle className="h-4 w-4" />,
    confirmMessage: 'This will mark the selected courses as inactive. They will no longer be visible on the website.',
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 className="h-4 w-4" />,
    variant: 'destructive',
    confirmMessage: 'This will permanently delete the selected courses and all their subjects, topics, and lessons. This action cannot be undone.',
  },
];

export const FACULTY_DEPARTMENT_BULK_ACTIONS: BulkAction[] = [
  {
    id: 'discontinue',
    label: 'Discontinue',
    icon: <XCircle className="h-4 w-4" />,
    confirmMessage: 'This will mark the selected items as inactive.',
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 className="h-4 w-4" />,
    variant: 'destructive',
    confirmMessage: 'This will permanently delete the selected items and all related data. This action cannot be undone.',
  },
];
