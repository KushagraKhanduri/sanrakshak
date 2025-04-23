
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageSquare, Edit } from 'lucide-react';

interface AddNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (text: string) => void;
}

const predefinedNotes = [
  "Contacted the beneficiary",
  "Unable to reach the beneficiary",
  "Items delivered successfully",
  "Partial delivery completed",
  "Need additional information",
  "Rescheduled for later",
  "Location is difficult to access",
  "Beneficiary not present at location"
];

const AddNoteDialog = ({ isOpen, onClose, onAddNote }: AddNoteDialogProps) => {
  const [noteType, setNoteType] = useState<'predefined' | 'custom'>('predefined');
  const [selectedNote, setSelectedNote] = useState('');
  const [customNote, setCustomNote] = useState('');

  const handleSubmit = () => {
    const noteText = noteType === 'predefined' ? selectedNote : customNote;
    if (noteText.trim()) {
      onAddNote(noteText);
      onClose();
      setSelectedNote('');
      setCustomNote('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Note</DialogTitle>
        </DialogHeader>
        
        <div className="flex space-x-2 mb-4">
          <Button
            variant={noteType === 'predefined' ? 'default' : 'outline'}
            onClick={() => setNoteType('predefined')}
            size="sm"
          >
            <MessageSquare size={16} className="mr-2" />
            Select Note
          </Button>
          <Button
            variant={noteType === 'custom' ? 'default' : 'outline'}
            onClick={() => setNoteType('custom')}
            size="sm"
          >
            <Edit size={16} className="mr-2" />
            Custom Note
          </Button>
        </div>
        
        {noteType === 'predefined' ? (
          <Select value={selectedNote} onValueChange={setSelectedNote}>
            <SelectTrigger>
              <SelectValue placeholder="Select a note template" />
            </SelectTrigger>
            <SelectContent>
              {predefinedNotes.map((note, index) => (
                <SelectItem key={index} value={note}>
                  {note}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Textarea 
            placeholder="Write your note here..."
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            className="min-h-[100px]"
          />
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteDialog;
