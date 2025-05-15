import { render, screen, fireEvent } from "@testing-library/react";
import BaseModal from "../components/BaseModal";

describe("BaseModal", () => {
  test("renders children when open is true", () => {
    render(
      <BaseModal open={true}>
        <div>Modal Content</div>
      </BaseModal>
    );

    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  test("does not render when open is false", () => {
    render(
      <BaseModal open={false}>
        <div>Should not be visible</div>
      </BaseModal>
    );

    expect(screen.queryByText("Should not be visible")).not.toBeInTheDocument();
  });

  test("calls onClose when clicking the backdrop", () => {
    const onCloseMock = jest.fn();

    render(
      <BaseModal open={true} onClose={onCloseMock}>
        <div>Content</div>
      </BaseModal>
    );

    const backdrop = screen.getByText("Content").parentElement?.parentElement!;
    fireEvent.click(backdrop);

    expect(onCloseMock).toHaveBeenCalled();
  });

  test("does not call onClose when clicking inside the modal content", () => {
    const onCloseMock = jest.fn();

    render(
      <BaseModal open={true} onClose={onCloseMock}>
        <div>Inner Content</div>
      </BaseModal>
    );

    const modalContent = screen.getByText("Inner Content");
    fireEvent.click(modalContent);

    expect(onCloseMock).not.toHaveBeenCalled();
  });
});
