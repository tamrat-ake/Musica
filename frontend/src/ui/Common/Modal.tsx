import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { BiX } from "react-icons/bi";
import { createPortal } from "react-dom";
import { keyframes } from "@emotion/react";

// Keyframe animations for entrance and exit
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
  }
`;

const Overlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75); /* Slightly darker overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  animation: ${({ $isVisible }) => ($isVisible ? fadeIn : fadeOut)} 0.3s
    ease-out forwards;
`;

const Content = styled.div<{ $isVisible: boolean }>`
  background-color: var(--second-background-color);
  border-radius: 16px; /* Slightly more rounded corners */
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5); /* More prominent shadow */
  border: 1px solid var(--accent-color);
  max-width: 550px; /* Slightly wider */
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  animation: ${({ $isVisible }) => ($isVisible ? slideUp : slideDown)} 0.3s
    cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; /* Bouncy entrance */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem; /* Adjusted padding */
  border-bottom: 1px solid rgba(var(--accent-color-rgb), 0.2); /* Softer border */
  background-color: rgba(
    var(--second-background-color-rgb),
    0.9
  ); /* Slight background to stand out */
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(5px); /* Frosted glass effect */
`;

const Title = styled.h3`
  color: var(--text-color);
  margin: 0;
  font-size: 1.5rem; /* Larger title */
  font-weight: 700; /* Bolder title */
  line-height: 1.2;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  outline: none;
  color: var(--text-color-secondary);
  cursor: pointer;
  padding: 0.6rem; /* Slightly larger hit area */
  border-radius: 8px; /* More rounded button */
  transition:
    color 0.3s ease,
    background-color 0.3s ease; /* Add background transition */

  &:hover {
    color: var(--accent-color); /* Highlight with accent color */
    background-color: rgba(
      var(--accent-color-rgb),
      0.1
    ); /* Subtle hover background */
  }

  svg {
    display: block; /* Ensures icon is centered */
  }
`;

const Body = styled.div`
  padding: 2rem;
  flex-grow: 1; /* Allows body to take up available space */
  color: var(--text-color); /* Ensure text color is consistent */
  line-height: 1.6;
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closeOnOverlayClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  closeOnOverlayClick = true,
}) => {
  const [shouldRender, setShouldRender] = React.useState(isOpen);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle body overflow
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setShouldRender(true);
    } else {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      animationTimeoutRef.current = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = "unset";
      }, 300); // Match animation duration
    }

    return () => {
      document.body.style.overflow = "unset";
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <Overlay $isVisible={isOpen} onClick={handleOverlayClick}>
      <Content $isVisible={isOpen}>
        {(title || closeOnOverlayClick) && ( // Render header if title or close button needed
          <Header>
            <Title>{title || "Modal"}</Title>{" "}
            {/* Default title if none provided */}
            <CloseButton onClick={onClose} aria-label="Close modal">
              <BiX size={26} /> {/* Slightly larger icon */}
            </CloseButton>
          </Header>
        )}
        <Body>{children}</Body>
      </Content>
    </Overlay>,
    document.body
  );
};

export default Modal;
