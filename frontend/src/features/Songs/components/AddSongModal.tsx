import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Button } from "../../../ui"; // Assuming Modal and Button are in ui folder
import { addSongStart } from "../../../redux/slices/songSlice";
import styled from "@emotion/styled";

// Styled Components for the form
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* Increased gap for better spacing */
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Gap between label and input */
`;

const Label = styled.label`
  color: var(--text-color-secondary); /* Softer label color */
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 0.25rem; /* Small space below label */
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  /* --- REVISED STYLING BELOW --- */
  border: 1px solid var(--input-border-color, #606060); /* Clearer, distinct border */
  border-radius: var(--radius-md, 8px);
  background-color: var(
    --background-color,
    #424242
  ); /* Clearly different from modal background */
  color: var(--text-color);
  font-size: 1rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.3);
    background-color: var(
      --background-color,
      #4c4c4c
    ); /* Slight change on focus */
  }

  &::placeholder {
    color: var(--text-colorr, #a0a0a0); /* Ensure placeholder is visible */
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem; /* Space above buttons */

  & > button {
    flex: 1; /* Make buttons share space equally */
  }
`;

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSongModal: React.FC<AddSongModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.artist.trim()) {
      // You might want to show a more explicit error message here
      alert("Song Title and Artist Name are required!");
      return;
    }

    const songData = {
      title: formData.title.trim(),
      artist: formData.artist.trim(),
      ...(formData.album.trim() && { album: formData.album.trim() }),
      ...(formData.genre.trim() && { genre: formData.genre.trim() }),
    };

    dispatch(addSongStart(songData));
    onClose();
    // Reset form fields after successful submission
    setFormData({ title: "", artist: "", album: "", genre: "" });
  };

  // Reset form when modal opens/closes to ensure fresh state
  React.useEffect(() => {
    if (!isOpen) {
      setFormData({ title: "", artist: "", album: "", genre: "" });
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add a New Song">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Song Title</Label>
          <Input
            id="title"
            type="text"
            name="title"
            placeholder="e.g., Bohemian Rhapsody"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="artist">Artist Name</Label>
          <Input
            id="artist"
            type="text"
            name="artist"
            placeholder="e.g., Queen"
            value={formData.artist}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="album">Album (Optional)</Label>
          <Input
            id="album"
            type="text"
            name="album"
            placeholder="e.g., A Night at the Opera"
            value={formData.album}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="genre">Genre (Optional)</Label>
          <Input
            id="genre"
            type="text"
            name="genre"
            placeholder="e.g., Rock, Pop, Classical"
            value={formData.genre}
            onChange={handleChange}
          />
        </FormGroup>

        <ButtonGroup>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add Song
          </Button>
        </ButtonGroup>
      </Form>
    </Modal>
  );
};

export default AddSongModal;
