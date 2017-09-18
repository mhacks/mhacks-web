// pure redux-action types
export default {
    SUBSCRIBE_REQUEST: 'SUBSCRIBE_REQUEST',
    SUBSCRIBE_SUCCESS: 'SUBSCRIBE_SUCCESS',
    SUBSCRIBE_ERROR: 'SUBSCRIBE_ERROR',
    REGISTER_REQUEST: 'REGISTER_REQUEST',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    REGISTER_ERROR: 'REGISTER_ERROR',
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_ERROR: 'LOGIN_ERROR',
    LOGOUT_REQUEST: 'LOGOUT_REQUEST',
    LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
    LOGOUT_ERROR: 'LOGOUT_ERROR',
    LOAD_PROFILE_REQUEST: 'LOAD_PROFILE_REQUEST',
    LOAD_PROFILE_ERROR: 'LOAD_PROFILE_ERROR',
    LOAD_PROFILE_SUCCESS: 'LOAD_PROFILE_SUCCESS',
    LOAD_PROFILE_FORM_REQUEST: 'LOAD_PROFILE_FORM_REQUEST',
    LOAD_PROFILE_FORM_SUCCESS: 'LOAD_PROFILE_FORM_SUCCESS',
    LOAD_PROFILE_FORM_ERROR: 'LOAD_PROFILE_FORM_ERROR',
    UPDATE_PROFILE_REQUEST: 'UPDATE_PROFILE_REQUEST',
    UPDATE_PROFILE_ERROR: 'UPDATE_PROFILE_ERROR',
    UPDATE_PROFILE_SUCCESS: 'UPDATE_PROFILE_SUCCESS',
    UPLOAD_APPLICATION_REQUEST: 'UPLOAD_APPLICATION_REQUEST',
    UPLOAD_APPLICATION_ERROR: 'UPLOAD_APPLICATION_ERROR',
    UPLOAD_APPLICATION_SUCCESS: 'UPLOAD_APPLICATION_SUCCESS',
    SEND_VERIFICATION_ERROR: 'SEND_VERIFICATION_ERROR',
    SEND_VERIFICATION_SUCCESS: 'SEND_VERIFICATION_SUCCESS',
    SEND_VERIFICATION_REQUEST: 'SEND_VERIFICATION_REQUEST',
    LOAD_ANNOUNCEMENTS_REQUEST: 'LOAD_ANNOUNCEMENTS_REQUEST',
    LOAD_ANNOUNCEMENTS_ERROR: 'LOAD_ANNOUNCEMENTS_ERROR',
    LOAD_ANNOUNCEMENTS_SUCCESS: 'LOAD_ANNOUNCEMENTS_SUCCESS',
    LOAD_EVENTS_REQUEST: 'LOAD_EVENTS_REQUEST',
    LOAD_EVENTS_ERROR: 'LOAD_EVENTS_ERROR',
    LOAD_EVENTS_SUCCESS: 'LOAD_EVENTS_SUCCESS',
    LOAD_CONFIGURATION_REQUEST: 'LOAD_CONFIGURATION_REQUEST',
    LOAD_CONFIGURATION_ERROR: 'LOAD_CONFIGURATION_ERROR',
    LOAD_CONFIGURATION_SUCCESS: 'LOAD_CONFIGURATION_SUCCESS',
    UPDATE_CONFIGURATION_REQUEST: 'UPDATE_CONFIGURATION_REQUEST',
    UPDATE_CONFIGURATION_ERROR: 'UPDATE_CONFIGURATION_ERROR',
    UPDATE_CONFIGURATION_SUCCESS: 'UPDATE_CONFIGURATION_SUCCESS',
    LOAD_CONFIGURATION_FORM_REQUEST: 'LOAD_CONFIGURATION_FORM_REQUEST',
    LOAD_CONFIGURATION_FORM_SUCCESS: 'LOAD_CONFIGURATION_FORM_SUCCESS',
    LOAD_CONFIGURATION_FORM_ERROR: 'LOAD_CONFIGURATION_FORM_ERROR',
    LOAD_HACKER_APPLICATIONS_REQUEST: 'LOAD_HACKER_APPLICATIONS_REQUEST',
    LOAD_HACKER_APPLICATIONS_ERROR: 'LOAD_HACKER_APPLICATIONS_ERROR',
    LOAD_HACKER_APPLICATIONS_SUCCESS: 'LOAD_HACKER_APPLICATIONS_SUCCESS',
    LOAD_APPLICATIONS_FORM_REQUEST: 'LOAD_APPLICATIONS_FORM_REQUEST',
    LOAD_APPLICATIONS_FORM_SUCCESS: 'LOAD_APPLICATIONS_FORM_SUCCESS',
    LOAD_APPLICATIONS_FORM_ERROR: 'LOAD_APPLICATIONS_FORM_ERROR',
    REVIEW_APPLICATIONS_REQUEST: 'REVIEW_APPLICATIONS_REQUEST',
    REVIEW_APPLICATIONS_ERROR: 'REVIEW_APPLICATIONS_ERROR',
    REVIEW_APPLICATIONS_SUCCESS: 'REVIEW_APPLICATIONS_SUCCESS',
    UPLOAD_CONFIRMATION_REQUEST: 'UPLOAD_CONFIRMATION_REQUEST',
    UPLOAD_CONFIRMATION_ERROR: 'UPLOAD_CONFIRMATION_ERROR',
    UPLOAD_CONFIRMATION_SUCCESS: 'UPLOAD_CONFIRMATION_SUCCESS',
    LOAD_CONFIRMATION_REQUEST: 'LOAD_CONFIRMATION_REQUEST',
    LOAD_CONFIRMATION_ERROR: 'LOAD_CONFIRMATION_ERROR',
    LOAD_CONFIRMATION_SUCCESS: 'LOAD_CONFIRMATION_SUCCESS',
    LOAD_CONFIRMATION_FORM_REQUEST: 'LOAD_CONFIRMATION_FORM_REQUEST',
    LOAD_CONFIRMATION_FORM_SUCCESS: 'LOAD_CONFIRMATION_FORM_SUCCESS',
    LOAD_CONFIRMATION_FORM_ERROR: 'LOAD_CONFIRMATION_FORM_ERROR',
    LOAD_READER_FORM_REQUEST: 'LOAD_READER_FORM_REQUEST',
    LOAD_READER_FORM_SUCCESS: 'LOAD_READER_FORM_SUCCESS',
    LOAD_READER_FORM_ERROR: 'LOAD_READER_FORM_ERROR',
    LOAD_SPONSOR_ERROR: 'LOAD_SPONSOR_ERROR',
    LOAD_SPONSOR_REQUEST: 'LOAD_SPONSOR_REQUEST',
    LOAD_SPONSOR_SUCCESS: 'LOAD_SPONSOR_SUCCESS',

    LOAD_MENTORSHIP_TICKETS_REQUEST: 'LOAD_MENTORSHIP_TICKETS_REQUEST',
    LOAD_MENTORSHIP_TICKETS_ERROR: 'LOAD_MENTORSHIP_TICKETS_ERROR',
    LOAD_MENTORSHIP_TICKETS_SUCCESS: 'LOAD_MENTORSHIP_TICKETS_SUCCESS',
    ACCEPT_MENTORSHIP_TICKET_REQUEST: 'ACCEPT_MENTORSHIP_TICKET_REQUEST',
    ACCEPT_MENTORSHIP_TICKET_ERROR: 'ACCEPT_MENTORSHIP_TICKET_ERROR',
    ACCEPT_MENTORSHIP_TICKET_SUCCESS: 'ACCEPT_MENTORSHIP_TICKET_SUCCESS',
    UNACCEPT_MENTORSHIP_TICKET_REQUEST: 'UNACCEPT_MENTORSHIP_TICKET_REQUEST',
    UNACCEPT_MENTORSHIP_TICKET_ERROR: 'UNACCEPT_MENTORSHIP_TICKET_ERROR',
    UNACCEPT_MENTORSHIP_TICKET_SUCCESS: 'UNACCEPT_MENTORSHIP_TICKET_SUCCESS',

    LOAD_MENTOR_APPLICATION_REQUEST: 'LOAD_MENTOR_APPLICATION_REQUEST',
    LOAD_MENTOR_APPLICATION_SUCCESS: 'LOAD_MENTOR_APPLICATION_SUCCESS',
    LOAD_MENTOR_APPLICATION_ERROR: 'LOAD_MENTOR_APPLICATION_ERROR',
    LOAD_MENTOR_APPLICATIONS_REQUEST: 'LOAD_MENTOR_APPLICATIONS_REQUEST',
    LOAD_MENTOR_APPLICATIONS_SUCCESS: 'LOAD_MENTOR_APPLICATIONS_SUCCESS',
    LOAD_MENTOR_APPLICATIONS_ERROR: 'LOAD_MENTOR_APPLICATIONS_ERROR',
    UPLOAD_MENTOR_APPLICATION_REQUEST: 'UPLOAD_MENTOR_APPLICATION_REQUEST',
    UPLOAD_MENTOR_APPLICATION_SUCCESS: 'UPLOAD_MENTOR_APPLICATION_SUCCESS',
    UPLOAD_MENTOR_APPLICATION_ERROR: 'UPLOAD_MENTOR_APPLICATION_ERROR',
    LOAD_MENTOR_APPLICATION_FORM_REQUEST:
        'LOAD_MENTOR_APPLICATION_FORM_REQUEST',
    LOAD_MENTOR_APPLICATION_FORM_SUCCESS:
        'LOAD_MENTOR_APPLICATION_FORM_SUCCESS',
    LOAD_MENTOR_APPLICATION_FORM_ERROR: 'LOAD_MENTOR_APPLICATION_FORM_ERROR',
    LOAD_SPEAKER_APPLICATION_REQUEST: 'LOAD_SPEAKER_APPLICATION_REQUEST',
    LOAD_SPEAKER_APPLICATION_SUCCESS: 'LOAD_SPEAKER_APPLICATION_SUCCESS',
    LOAD_SPEAKER_APPLICATION_ERROR: 'LOAD_SPEAKER_APPLICATION_ERROR',
    LOAD_SPEAKER_APPLICATIONS_REQUEST: 'LOAD_SPEAKER_APPLICATIONS_REQUEST',
    LOAD_SPEAKER_APPLICATIONS_SUCCESS: 'LOAD_SPEAKER_APPLICATIONS_SUCCESS',
    LOAD_SPEAKER_APPLICATIONS_ERROR: 'LOAD_SPEAKER_APPLICATIONS_ERROR',
    LOAD_SPONSOR_PORTAL_APPLICATIONS_REQUEST:
        'LOAD_SPONSOR_PORTAL_APPLICATIONS_REQUEST',
    LOAD_SPONSOR_PORTAL_APPLICATIONS_ERROR:
        'LOAD_SPONSOR_PORTAL_APPLICATIONS_ERROR',
    LOAD_SPONSOR_PORTAL_APPLICATIONS_SUCCESS:
        'LOAD_SPONSOR_PORTAL_APPLICATIONS_SUCCESS',
    UPLOAD_SPEAKER_APPLICATION_REQUEST: 'UPLOAD_SPEAKER_APPLICATION_REQUEST',
    UPLOAD_SPEAKER_APPLICATION_SUCCESS: 'UPLOAD_SPEAKER_APPLICATION_SUCCESS',
    UPLOAD_SPEAKER_APPLICATION_ERROR: 'UPLOAD_SPEAKER_APPLICATION_ERROR',
    LOAD_SPEAKER_APPLICATION_FORM_REQUEST:
        'LOAD_SPEAKER_APPLICATION_FORM_REQUEST',
    LOAD_SPEAKER_APPLICATION_FORM_SUCCESS:
        'LOAD_SPEAKER_APPLICATION_FORM_SUCCESS',
    LOAD_SPEAKER_APPLICATION_FORM_ERROR: 'LOAD_SPEAKER_APPLICATION_FORM_ERROR',
    LOAD_TEAMS_REQUEST: 'LOAD_TEAMS_REQUEST',
    LOAD_TEAMS_ERROR: 'LOAD_TEAMS_ERROR',
    LOAD_TEAMS_SUCCESS: 'LOAD_TEAMS_SUCCESS',
    CREATE_TEAM_REQUEST: 'CREATE_TEAM_REQUEST',
    CREATE_TEAM_ERROR: 'CREATE_TEAM_ERROR',
    CREATE_TEAM_SUCCESS: 'CREATE_TEAM_SUCCESS',
    DELETE_TEAM_REQUEST: 'DELETE_TEAM_REQUEST',
    DELETE_TEAM_ERROR: 'DELETE_TEAM_ERROR',
    DELETE_TEAM_SUCCESS: 'DELETE_TEAM_SUCCESS',
    JOIN_TEAM_REQUEST: 'JOIN_TEAM_REQUEST',
    JOIN_TEAM_ERROR: 'JOIN_TEAM_ERROR',
    JOIN_TEAM_SUCCESS: 'JOIN_TEAM_SUCCESS',
    LEAVE_TEAM_REQUEST: 'LEAVE_TEAM_REQUEST',
    LEAVE_TEAM_ERROR: 'LEAVE_TEAM_ERROR',
    LEAVE_TEAM_SUCCESS: 'LEAVE_TEAM_SUCCESS',
    LOAD_TEAM_FORM_REQUEST: 'LOAD_TEAM_FORM_REQUEST',
    LOAD_TEAM_FORM_ERROR: 'LOAD_TEAM_FORM_ERROR',
    LOAD_TEAM_FORM_SUCCESS: 'LOAD_TEAM_FORM_SUCCESS',
    ADMIN_LOAD_MODELS_REQUEST: 'ADMIN_LOAD_MODELS_REQUEST',
    ADMIN_LOAD_MODELS_SUCCESS: 'ADMIN_LOAD_MODELS_SUCCESS',
    ADMIN_LOAD_MODELS_FAILURE: 'ADMIN_LOAD_MODELS_FAILURE',
    ADMIN_LOAD_MODEL_REQUEST: 'ADMIN_LOAD_MODEL_REQUEST',
    ADMIN_LOAD_MODEL_SUCCESS: 'ADMIN_LOAD_MODEL_SUCCESS',
    ADMIN_LOAD_MODEL_FAILURE: 'ADMIN_LOAD_MODEL_FAILURE'
};
