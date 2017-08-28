function getGroup(userData, groupName) {
    return (
        userData.user &&
        userData.user.groups &&
        userData.user.groups.indexOf(groupName) !== -1
    );
}

export function getUserMetadata(userData) {
    return {
        isLoggedIn: userData.isLoggedIn === true,
        isApplicationSubmitted: userData.isApplicationSubmitted === true,
        isApplicationReviewed: userData.user.status !== 'unread',
        isAccepted: userData.user.status === 'accepted',
        isWaitlisted: userData.user.status === 'waitlisted',
        isConfirmed: userData.user.isConfirmed === true,
        isEmailVerified: userData.isEmailVerified === true,
        isAdmin: getGroup(userData, 'admin'),
        isSponsor: getGroup(userData, 'sponsor'),
        isReader: getGroup(userData, 'reader'),
        needsReimbursement: userData.user.needs_reimbursement === true
    };
}

export function isMinor(birthdate) {
    const now = new Date();
    const birth = new Date(birthdate);

    var age = now.getFullYear() - birth.getFullYear();
    const ageMonth = now.getMonth() - birth.getMonth();
    const ageDay = now.getDate() - birth.getDate();

    if (ageMonth < 0 || (ageMonth === 0 && ageDay < 0)) {
        age = parseInt(age) - 1;
    }

    return age < 18;
}
