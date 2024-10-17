import { POP_UP_ERROR_COLOR, POP_UP_SUCCESS_COLOR } from "./const";

export function displayErrorPopup(
    showNotification: { set: (value: boolean) => void },
    notificationTitle: { set: (value: string) => void },
    notificationMessage: { set: (value: string) => void },
    backgroundColor: { set: (value: string) => void },
    title: string,
    message: string,
) {
    backgroundColor.set(POP_UP_ERROR_COLOR);
    notificationTitle.set(title);
    notificationMessage.set(message);
    showNotification.set(true);

    setTimeout(() => {
        showNotification.set(false);
    }, 4000);
}

export function displaySuccessPopup(
    showNotification: { set: (value: boolean) => void },
    notificationTitle: { set: (value: string) => void },
    notificationMessage: { set: (value: string) => void },
    backgroundColor: { set: (value: string) => void },
    title: string,
    message: string,
) {
    backgroundColor.set(POP_UP_SUCCESS_COLOR);
    notificationTitle.set(title);
    notificationMessage.set(message);
    showNotification.set(true);

    setTimeout(() => {
        showNotification.set(false);
    }, 4000);
}
