export const FieldTypes = {
    TEXT: 0,
    LINK: 1,
    DATE: 2,
    SELECT: 3
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
