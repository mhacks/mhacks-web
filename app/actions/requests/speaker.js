import { endpoints } from '../../constants';
import { getResponseFromRoute, postFormData } from '../../util/actions.js';

export default class SpeakerRequests {
    static uploadApplication(token, body, files) {
        return postFormData(endpoints.SPEAKER_APPLICATION, token, body, files);
    }

    static loadApplication() {
        return getResponseFromRoute(endpoints.SPEAKER_APPLICATION);
    }

    static loadForm() {
        return getResponseFromRoute(endpoints.SPEAKER_APPLICATION_FORM);
    }
}
