import * as React from 'react'
import style from '../ModalDelivery.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../../store/modalDelivery/modalDeliverySlice';
import { Formik, Form, Field } from 'formik';
import { validateDeliveryForm } from './validateDeliveryForm';
import { submitForm } from './response';
import { clearOrder } from '../../../store/order/orderSlice';
import InputField from './InputField';
import RadioButton from './RadioButton';
import OrderDeliveryForm from './OrderDeliveryForm';
import Swal from 'sweetalert2'

export default function ModalForm() {
	const dispatch = useDispatch()
	const { orderList, totalPrice, totalCount } = useSelector(state => state.order)
	const [startDate, setStartDate] = React.useState(new Date());

	return (
		<Formik
			initialValues={{
				name: '',
				phone: '',
				format: 'delivery',
				adress: '',
				floor: '',
				intercom: '',
				comments: '',
			}}
			validate={validateDeliveryForm}
			onSubmit={
				(values) => {
					submitForm(values, orderList, totalPrice, totalCount)
					Swal.fire({
						position: 'center',
						icon: 'success',
						title: 'Ваш заказ будет обработан в ближайшее время. Мы обязательно с Вами свяжемся.',
						showConfirmButton: false,
						timer: 2500
					})
					dispatch(clearOrder())
					dispatch(closeModal())
				}
			}
		>
			{({
				values,
				errors,
				touched,
				handleChange,
				handleBlur,
				handleSubmit,
			}) => (
				<Form
					className={style.form}
					onSubmit={handleSubmit}
				>
					<InputField
						label='Имя'
						type="text"
						name="name"
						handleChange={handleChange}
						handleBlur={handleBlur}
						value={values.name}
						errors={errors.name}
						touched={touched.name}
					/>
					<InputField
						label='Телефон'
						type="tel"
						name="phone"
						handleChange={handleChange}
						handleBlur={handleBlur}
						value={values.phone}
						errors={errors.phone}
						touched={touched.phone}
					/>
					<fieldset className={style.fieldset_radio}>
						<RadioButton
							label='Самовывоз'
							value='pickup'
							handleChange={handleChange}
						/>
						<RadioButton
							label='Доставка'
							value='delivery'
							handleChange={handleChange}
						/>
					</fieldset>
					{values.format === 'delivery' && (
						<OrderDeliveryForm
							handleChange={handleChange}
							handleBlur={handleBlur}
							values={values}
							errors={errors}
							touched={touched}
						/>
					)}
					<input
						type="date"
						name="date"
						value={startDate}
						min={startDate}
						onChange={(date) => setStartDate(date)}
					/>
					<Field
						as='textarea'
						className={style.comments}
						rows={3}
						type='text'
						name='comments'
						value={values.comments}
						placeholder='Комментарии к заказу'
						onChange={handleChange}
					/>
					<button
						className={style.submit}
						type='submit'
						disabled={!Object.keys(touched).length || Object.keys(errors).length}
					>
						Оформить
					</button>
				</Form>
			)}
		</Formik>
	)
}