// plansDialogs.js
// Wraps every SweetAlert2 popup used by the Plans feature, so the rest of the
// code never has to build a Swal.fire() config by hand.
// NOTE: this file assumes SweetAlert2 is loaded globally (the <script> tag from
// their CDN), so "Swal" is available without an import.

export class PlansDialogs {
  // Shared toast config - reused by showSaved/showAlreadySaved
  static toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timerProgressBar: true,
  });

  static confirmRemove() {
    return Swal.fire({
      title: "Remove Plan?",
      text: "Are you sure you want to remove this plan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#475569",
      confirmButtonText: "Yes, remove it!",
    });
  }

  static confirmClearAll() {
    return Swal.fire({
      title: "Clear All Plans?",
      text: "This will permanently delete all your saved plans. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#475569",
      confirmButtonText: "Yes, clear all!",
    });
  }

  // Shown instead of the destructive confirm when there's nothing to clear
  static showNoPlansToClear() {
    return Swal.fire({
      title: "No Plans",
      text: "There are no saved plans to clear.",
      icon: "info",
    });
  }

  static showRemoved() {
    return Swal.fire({
      title: "Removed!",
      text: "The plan has been removed.",
      icon: "success",
    });
  }

  static showCleared() {
    return Swal.fire({
      title: "Cleared!",
      text: "All your plans have been removed.",
      icon: "success",
    });
  }

  // Small toast (bottom-right), used when a Save button is clicked from
  // the Events / Holidays / Long Weekends views.
  // Swal.close() first makes sure only one toast is ever visible at a time,
  // even if the user clicks Save on several cards quickly.
  static showSaved() {
    Swal.close();
    return PlansDialogs.toast.fire({
      icon: "success",
      title: "Saved to My Plans!",
      timer: 2500,
    });
  }

  static showAlreadySaved() {
    Swal.close();
    return PlansDialogs.toast.fire({
      icon: "info",
      title: "Already saved!",
      timer: 2000,
    });
  }
}
