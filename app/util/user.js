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
