import { endpoints } from '../../constants';
import { getResponseFromRoute, postFormData } from '../../util/actions.js';

export default class MentorRequests {
    static uploadApplication(token, body, files) {
        return postFormData(endpoints.MENTOR_APPLICATION, token, body, files);
    }

    static loadApplication() {
        return getResponseFromRoute(endpoints.MENTOR_APPLICATION);
    }

    static loadForm() {
        return getResponseFromRoute(endpoints.MENTOR_APPLICATION_FORM);
    }
}
