function getGroup(userData, groupName) {
    return (
        userData.user &&
        userData.user.groups &&
        userData.user.groups.indexOf(groupName) !== -1
    );
}

export function getUserMetadata(userData) {
    return {
        isLoggedIn: userData.isLoggedIn,
        isApplicationSubmitted: userData.isApplicationSubmitted,
        isEmailVerified: userData.isEmailVerified,
        isAdmin: getGroup(userData, 'admin'),
        isSponsor: getGroup(userData, 'sponsor'),
        isReader: getGroup(userData, 'reader')
    };
}
