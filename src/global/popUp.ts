export function displayErrorPopup(
    showNotification: { set: (value: boolean) => void },
    notificationTitle: { set: (value: string) => void },
    notificationMessage: { set: (value: string) => void },
    type: { set: (value: string) => void },
    title: string,
    message: string,
) {
    type.set("error");
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
    type: { set: (value: string) => void },
    title: string,
    message: string,
) {
    type.set("success");
    notificationTitle.set(title);
    notificationMessage.set(message);
    showNotification.set(true);

    setTimeout(() => {
        showNotification.set(false);
    }, 4000);
}
