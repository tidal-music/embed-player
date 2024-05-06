import DOMRefs from './dom-refs.js';
import { $ } from './fake-query.js';

/**
 * @typedef {"finished"|"share"|"nostr"} DialogName
 */
class DialogController {
  /**
   * Close a dialog
   *
   * @param {DialogName} dialogName
   */
  static close(dialogName) {
    const dialog = $(`dialog.dialog--${dialogName}`);

    if (dialog instanceof HTMLDialogElement) {
      dialog.close();
    }

    DOMRefs.embedWrapper?.classList.remove(`showing-${dialogName}-dialog`);
  }

  /**
   * Show a dialog
   *
   * @param {DialogName} dialogName
   */
  static show(dialogName) {
    const dialog = $(`dialog.dialog--${dialogName}`);

    if (dialog instanceof HTMLDialogElement) {
      dialog.showModal();
    }

    DOMRefs.embedWrapper?.classList.add(`showing-${dialogName}-dialog`);

    // Focus first button in the dialog, if there is one.
    const button = $(`dialog.dialog--${dialogName} button`);

    if (button instanceof HTMLButtonElement) {
      button.focus();
    }
  }
}

export default DialogController;
