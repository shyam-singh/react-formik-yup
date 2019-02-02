import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Formik, FieldArray, getIn } from 'formik';
import * as Yup from 'yup';

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 200,
	},
	button: {
		margin: theme.spacing.unit,
	},
});

const Schema = Yup.object().shape({
	names: Yup.array().of(Yup.object().shape({
		value: Yup.string().required('Required'),
	})
	).required('Required')
});

const TextFieldWithErrorMessage = ({ id, label, name, className, value, onChange, onBlur, margin, errors, touched }) => (
	<TextField
		id={id}
		label={label}
		name={name}
		className={className}
		value={value}
		onChange={onChange}
		onBlur={onBlur}
		margin={margin}
		error={Boolean(getIn(touched, name)) && Boolean(getIn(errors, name))}
		helperText={Boolean(getIn(touched, name)) && Boolean(getIn(errors, name)) && getIn(errors, name)}
	/>
)

class Form extends Component {
	state = {
		names: [{ value: 'Cat in the Hat' }],
	};

	render() {
		const { classes } = this.props;
		const { names } = this.state;
		return (
			<Formik
				initialValues={{ names: names }}
				validationSchema={Schema}
				onSubmit={(values, { setSubmitting }) => {
					// same shape as initial values
					console.log(values);
					setSubmitting(false);
				}}
			>
				{({
					values,
					errors,
					status,
					touched,
					handleBlur,
					handleChange,
					handleSubmit,
					isSubmitting,
				}) => (
						<div>
							<form onSubmit={handleSubmit} className={classes.container} noValidate autoComplete="off">
								<FieldArray name="names"
									render={arrayHelpers => (
										<div>
											{values.names && values.names.length > 0 ? (
												values.names.map((name, index) => (
													<div key={index}>
														<TextFieldWithErrorMessage
															id={`standard-name-${index}`}
															label="Name"
															name={`names[${index}].value`}
															className={classes.textField}
															value={name.value}
															onChange={handleChange}
															onBlur={handleBlur}
															margin="normal"
															errors={errors}
															touched={touched} />
														<Button
															onClick={() => arrayHelpers.remove(index)} // remove a name from the list
														>
															-
                      									</Button>
														<Button
															onClick={() => arrayHelpers.insert(index, { value: '' })} // insert an empty string at a position
														>
															+
                      									</Button>
													</div>
												))
											) : (
													<Button onClick={() => arrayHelpers.push({ value: '' })}>
														{/* show this when user has removed all names from the list */}
														Add a name
                  									</Button>
												)}
											<div>
												<Button type="submit" variant="contained" color="primary" className={classes.button} disabled={isSubmitting}>
													Submit
              									</Button>
											</div>
										</div>
									)}
								/>
							</form>
						</div>
					)}
			</Formik>
		)
	}
}

Form.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Form);