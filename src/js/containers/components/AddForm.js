import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'sass/app.css';
import { insertDate, deleteDate, editDate } from 'js/containers/components/UserDataController';
// store
import { useAddFormState } from 'js/stores/addFormState';
import { useUserData } from 'js/stores/userData';
import { useErrorState } from 'js/stores/errorState';

const AddForm = () => {
	
	const [ addFormState, setAddFormState ] = useAddFormState();
	const { active, mode } = addFormState;

	const [ newAddFormState, setNewAddFormState ] = useState({
		title: '',
		curDate: new Date(),
		startHour: 0,
		endHour: 1
	});
	const { title, curDate, startHour, endHour } = newAddFormState;
	const [ userData, setUserData ] = useUserData();
	const { schedule } = userData;
	const [ beforeEdit, setBeforeEdit ] = useState();
	const [ errorState, setErrorState ] = useErrorState();

	useEffect(
		() => {
			if (active) {
				const { title, curDate, startHour, endHour } = addFormState;
				setNewAddFormState({ title, curDate, startHour, endHour });
				if (mode === 'edit') {
					setBeforeEdit({ title, curDate, startHour, endHour });
				}
			}
		},
		[ active ]
	);

	const onChangeCurDate = (value) => {
		setNewAddFormState({ ...newAddFormState, curDate: value });
	};

	const onChangeNewAddFormState = (e) => {
		const { id, value } = e.target;
		switch (id) {
			case 'input-title':
				setNewAddFormState({ ...newAddFormState, title: value });
				break;
			case 'hour-start-select':
				const newStartHour = value * 1;
				const newEndHour = newStartHour < endHour ? endHour : newStartHour + 1;
				setNewAddFormState({ ...newAddFormState, startHour: newStartHour, endHour: newEndHour });
				break;
			case 'hour-end-select':
				setNewAddFormState({ ...newAddFormState, endHour: value * 1 });
				break;
			default:
				break;
		}
	};

	const onClickCancel = () => {
		setAddFormState({ ...addFormState, active: false });
	};

	const onClickAdd = () => {
		if (title === '') return;

		const newSchedule = insertDate(newAddFormState, schedule);
		if (newSchedule !== false) {
			setUserData({ ...userData, schedule: newSchedule });
			setAddFormState({ ...addFormState, active: false });

		}
	};

	const onClickEdit = () => {
		if (title === '') return;

		const newSchedule = editDate(newAddFormState, beforeEdit, schedule);

		if (newSchedule !== false) {
			setUserData({ ...userData, schedule: newSchedule });
			setAddFormState({ ...addFormState, active: false });
		}
	};

	const onClickDelete = () => {
		const newSchedule = deleteDate(curDate, startHour, endHour, schedule);
		setUserData({ ...userData, schedule: newSchedule });
		setAddFormState({ ...addFormState, active: false });
		setErrorState({
			...errorState,
			active: true,
			mode: 'delete',
			message: [ [ '????????? ?????? ???????????????.' ] ]
		});
	};

	if (!active) return null;
	else if (active)
		return (
			<div id="panel">
				<div id="add-form">
					<div id="add-form-title">{mode === 'add' ? '?????? ??????' : '?????? ??????'}</div>
					<div id="input-form">
						<div className="label">??????</div>
						<input id="input-title" value={title} onChange={onChangeNewAddFormState} />
					</div>
					<div id="date-picker-form">
						<div className="label">??????</div>
						<div id="date-picker">
							<DatePicker selected={curDate} onChange={onChangeCurDate} />
						</div>
					</div>
					<div id="option-form">
						<div id="cancel-btn" className="btn" onClick={onClickCancel}>
							??????
						</div>
						{mode === 'add' ? (
							<div id="add-btn" className="btn" onClick={onClickAdd}>
								??????
							</div>
						) : null}
						{mode === 'edit' ? (
							<div id="edit-btn" className="btn" onClick={onClickEdit}>
								??????
							</div>
						) : null}

						{mode === 'edit' ? (
							<div id="delete-btn" className="btn" onClick={onClickDelete}>
								??????
							</div>
						) : null}
					</div>
				</div>
			</div>
		);
};

export default AddForm;