import { endpoints } from '../../constants';
import { getResponseFromRoute, postFormData } from '../../util/actions.js';

export default class MentorRequests {
    static uploadApplication(token, body, files) {
        return postFormData(endpoints.MENTOR_APPLICATION, token, body, files);
    }

    static loadApplication(token) {
        return getResponseFromRoute(endpoints.MENTOR_APPLICATION, token);
    }

    static loadForm(token) {
        return getResponseFromRoute(endpoints.MENTOR_APPLICATION_FORM, token);
    }
}
