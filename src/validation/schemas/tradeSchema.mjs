import * as Yup from 'yup';

const checkboxSchema = Yup.string().required('A source type is required');

const tradeSchema = Yup.object().shape({
    kWh: Yup.number()
        .typeError('Amount must be a number')
        .positive('Amount must be positive')
        .test('valid-number', 'Must be a valid whole number',
            value => !isNaN(value) && Number.isInteger(value))
        .min(3, 'Amount must be at least 3 kWh')
        .required('Amount of kWh is required'),
    sourceTypes: Yup.array()
        .of(Yup.number())
        .min(1, 'At least one source type must be selected')
        .required('At least one source type is required')
});

export default tradeSchema;