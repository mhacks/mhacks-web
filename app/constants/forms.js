export const FieldTypes = {
    TEXT: 0,
    LINK: 1,
    DATE: 2,
    SELECT: 3,
    INTEGER: 4,
    ESSAY: 5,
    BOOLEAN: 6,
    SECTIONHEADER: 7,
    MULTI: 8
};

export const ProfileFields = {
    name: FieldTypes.TEXT,
    university: FieldTypes.TEXT,
    major: FieldTypes.TEXT,
    github: FieldTypes.LINK,
    linkedin: FieldTypes.LINK,
    devpost: FieldTypes.LINK,
    portfolio: FieldTypes.LINK,
    tshirt: FieldTypes.SELECT,
    race: FieldTypes.SELECT,
    sex: FieldTypes.SELECT,
    birthday: FieldTypes.DATE
};

const required = true;
const optional = false;

export const HackerApplicationFields = [
    {
        type: FieldTypes.SECTIONHEADER,
        title: 'General'
    },
    {
        type: FieldTypes.DATE,
        label: 'Date of Birth',
        placeholder: 'mm/dd/yyyy',
        key: 'birthday',
        required
    },
    {
        type: FieldTypes.TEXT,
        label: 'University',
        placeholder: 'e.g. University of Michigan',
        key: 'university',
        required,
        autocomplete: require('../../static/misc/universities.json')
    },
    {
        type: FieldTypes.TEXT,
        label: 'Major',
        placeholder: 'e.g. Computer Science',
        key: 'major',
        required,
        autocomplete: require('../../static/misc/majors.json')
    },
    {
        type: FieldTypes.SELECT,
        label: 'T-Shirt Size',
        key: 'tshirt',
        values: [
            {
                key: 'unselected',
                value: 'Select'
            },
            {
                key: 'xs',
                value: 'XS'
            },
            {
                key: 's',
                value: 'S'
            },
            {
                key: 'm',
                value: 'M'
            },
            {
                key: 'l',
                value: 'L'
            },
            {
                key: 'xl',
                value: 'XL'
            },
            {
                key: '2xl',
                value: '2XL'
            },
            {
                key: '3xl',
                value: '3XL'
            }
        ],
        required
    },
    {
        type: FieldTypes.SECTIONHEADER,
        title: 'Links'
    },
    {
        type: FieldTypes.LINK,
        label: 'GitHub',
        placeholder: 'https://github.com/',
        key: 'github',
        optional
    },
    {
        type: FieldTypes.LINK,
        label: 'LinkedIn',
        placeholder: 'https://linkedin.com/in/',
        key: 'linkedin',
        optional
    },
    {
        type: FieldTypes.LINK,
        label: 'DevPost',
        placeholder: 'https://devpost.com/',
        key: 'devpost',
        optional
    },
    {
        type: FieldTypes.LINK,
        label: 'Portfolio',
        placeholder: 'https://',
        key: 'portfolio',
        optional
    },
    {
        type: FieldTypes.SECTIONHEADER,
        title: 'Demographics'
    },
    {
        type: FieldTypes.SELECT,
        label: 'Race',
        key: 'race',
        values: [
            {
                key: 'unselected',
                value: 'Select'
            },
            {
                key: 'white',
                value: 'White'
            },
            {
                key: 'black',
                value: 'Black'
            },
            {
                key: 'am-indian-alaskan',
                value: 'American Indian or Alaskan Native'
            },
            {
                key: 'asian',
                value: 'Asian or Pacific Islander'
            },
            {
                key: 'hispanic',
                value: 'Hispanic'
            },
            {
                key: 'other',
                value: 'Other'
            },
            {
                key: 'prefer-not',
                value: 'Prefer not to answer'
            }
        ],
        optional
    },
    {
        type: FieldTypes.SELECT,
        label: 'Sex',
        key: 'sex',
        values: [
            {
                key: 'unselected',
                value: 'Select'
            },
            {
                key: 'male',
                value: 'Male'
            },
            {
                key: 'female',
                value: 'Female'
            },
            {
                key: 'other',
                value: 'Other'
            },
            {
                key: 'prefer-not',
                value: 'Prefer not to answer'
            }
        ],
        optional
    },
    {
        type: FieldTypes.SECTIONHEADER,
        title: 'Short Answer'
    },
    {
        type: FieldTypes.SELECT,
        label: 'Experience',
        key: 'experience',
        values: [
            {
                key: 'novice',
                value: '0-1 Hackathons (Novice)'
            },
            {
                key: 'experienced',
                value: '2-5 Hackathons (Experienced)'
            },
            {
                key: 'veteran',
                value: '6+ Hackathons (Veteran)'
            }
        ],
        required
    },
    {
        type: FieldTypes.ESSAY,
        label: 'Why do you want to come to MHacks?',
        placeholder: '',
        key: 'why_mhacks',
        required
    },
    {
        type: FieldTypes.ESSAY,
        label: 'What is your favorite memory from  MHacks (if applicable)?',
        placeholder: '',
        key: 'favorite_memory',
        optional
    },
    {
        type: FieldTypes.ESSAY,
        label: 'Anything else you would like to tell us?',
        placeholder: '',
        key: 'anything_else',
        optional
    },
    {
        type: FieldTypes.SELECT,
        label: 'Do you need travel reimbursement?',
        key: 'needs_reimbursement',
        wideLabel: true,
        values: [
            {
                key: 'false',
                value: 'No'
            },
            {
                key: 'true',
                value: 'Yes'
            }
        ],
        optional
    },
    {
        type: FieldTypes.TEXT,
        label: 'Departing From',
        key: 'departing_from',
        wideLabel: true,
        required: false
    },
    {
        type: FieldTypes.INTEGER,
        label: 'How much reimbursement do you expect to need?',
        key: 'requested_reimbursement',
        wideLabel: true,
        required: false
    }
];
