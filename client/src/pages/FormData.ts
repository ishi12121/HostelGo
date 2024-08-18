import * as yup from 'yup';

// Define your schema
export const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  department: yup.string().required("Department is required"),
  rollno: yup.string().required("Roll Number is required"),
  year: yup.string().required("Year is required"),
  dateFrom: yup.date().required("Date From is required"),
  dateTo: yup.date().required("Date To is required"),
  timeFrom: yup.string().required("Time From is required"),
  timeTo: yup.string().required("Time To is required"),
  phNo: yup.string().required("Phone Number is required"),
  parentPhNo: yup.string().required("Parent Phone Number is required"),
  reason: yup.string().required("Reason is required"),
  city: yup.string().required("City is required"),
});
