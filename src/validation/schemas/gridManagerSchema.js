import * as Yup from 'yup';

const radioSchema = Yup.string().required('A grid selection is required');

const gridManagerSchema = Yup.object().shape({
    radio: radioSchema
});

export default gridManagerSchema;