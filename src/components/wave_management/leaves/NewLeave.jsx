import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import Loading 		from 'react-loading';
import {dateFormat} from  '../../common/Dateformat.js'
import TimePicker from 'react-times';

// use material theme
import 'react-times/css/material/default.css';
// or you can use classic theme
import 'react-times/css/classic/default.css';

class NewLeave extends React.Component{
	getInitialState(){
		return {
			start_date:new Date(),
			start_time:"",
			end_date:new Date(),
			end_time:"",
			type:"",
			location:"",
			host:"",
			notes:"",
			transportation:"",
			return_transportation:"",
			status:"",
			student_id:"",
			message:"",
			message_error:"",
			change:false

		}
	}
	constructor(props){
		super(props)
		this.state = this.getInitialState()
		this.handleChange = this.handleChange.bind(this)
		this.handleChangeDate = this.handleChangeDate.bind(this)
		this.handleAddLeave = this.handleAddLeave.bind(this)
		this.handleUpdateLeave = this.handleUpdateLeave.bind(this)
		this.redirectOnStudent = this.redirectOnStudent.bind(this)
	}
	handleChange(event){
		let name 	= event.target.name
		let value 	= event.target.value
		let state = Object.assign({},this.state)
		state[name] = value
		this.setState(state)
		
	}
	handleChangeDate(day,name){
		this.setState({[name]:day})
	}
	setTimeStart(name,time){
		let d = new Date(this.state.start_date)
		const [hour, minute] = time.split(':');
		d.setHours(hour)
		d.setMinutes(minute)
		this.setState({start_time:time,start_date:d})
	}
	setTimeEnd(name,time){
		let d = new Date(this.state.end_date)
		const [hour, minute] = time.split(':');
		d.setHours(hour)
		d.setMinutes(minute)
		this.setState({end_time:time,end_date:d})
	}
	componentDidMount(){
		
	}
	componentWillReceiveProps(nextProps){

	}

	renderSelect(txt,options,name,key_value,k){
		if(!options){
			return null
		}
		const optionsList =() =>{
			return Object.keys(options).map((row,key)=>
				  <option key={key} value={options[row][key_value]}>{options[row][key_value]}</option>
			)
		}
		return <select key={k} value={this.state[name]} className={this.renderClass(name)} name={name} onChange={this.handleChange} required >
			      <option value="">{txt}</option>
			      {optionsList()}
		    </select>
	}
	handleAddLeave(event){
		event.preventDefault
		const {params,firebase} = this.props
		let this_ = this
		if(!params.id_student){
			return null
		}
		let values={
			type:this.state.type,
			last_updated_at:new Date(),
			location:this.state.location,
			host:this.state.host,
			notes:this.state.notes,
			start_date:dateFormat(this.state.start_date,'yyyy-mm-dd',true,true),
			end_date:dateFormat(this.state.end_date,'yyyy-mm-dd',true,true),
			transportation:this.state.transportation,
			return_transportation:this.state.return_transportation,
			status:"pending",
			student_id:params.id_student
		}
		if(values.type == "" || values.location=="" || values.host=="" || values.start_date=="" || values.end_date==""){
			this_.setState({message_error:"All fields are mandatory",change:true})

			setTimeout(function(){
				this_.setState({message_error:""})
			},3000)
		}else{
			firebase.push("leaves",values)
			this_.setState({message:"Leave saved successfully",change:false})
			setTimeout(function(){
				this_.setState(this_.getInitialState())
			},3000)
		}
	}
	handleUpdateLeave(event){
		const {params,firebase} = this.props
		let this_ = this
		if(!params.id_student && !params.id_leave){
			return null
		}
		let values={
			type:this.state.type,
			last_updated_at:new Date(),
			location:this.state.location,
			host:this.state.host,
			notes:this.state.notes?this.state.notes:"",
			start_date:dateFormat(this.state.start_date,'yyyy-mm-dd',true,true),
			end_date:dateFormat(this.state.end_date,'yyyy-mm-dd',true,true),
			transportation:this.state.transportation,
			return_transportation:this.state.return_transportation,
			status:"pending",
			student_id:params.id_student
		}

		if(values.type == "" || values.location=="" || values.host=="" || values.start_date=="" || values.end_date==""){
			this_.setState({message_error:"All fields are mandatory",change:true})

			setTimeout(function(){
				this_.setState(this_.getInitialState())
			},3000)
		}else{
			firebase.update("leaves/"+params.id_leave,values)
			this_.setState({message:"Leave updated successfully",change:false})
			setTimeout(function(){
				this_.setState({message:""})
			},3000)
		}
	}
	redirectOnStudent(){
		const {params} = this.props
		this.props.router.push(window.basepath+'/home/'+params.id_student)
	}
	renderSuccess(){
		return this.state.message?<div className="alert alert-success" role="alert">{this.state.message}</div>:null
	}
	renderAlert(){
		return this.state.message_error?<div className="alert alert-danger" role="alert">{this.state.message_error}</div>:null
	}
	renderClass(name){
		return this.state[name]=="" && this.state.change   ? "form-control is-invalid ":"form-control" 
	}
	renderButtonActions(){
		const{params} = this.props
		
		if(params.id_leave){
			return <button onClick={this.handleUpdateLeave}  className="btn btn-md bg-warning b-round" type="button">Update Leave</button>
		}
		return <button onClick={this.handleAddLeave}  className="btn btn-md bg-principal b-round" type="button">Create Leave</button>
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.leaves){
			if(this.props.params.id_leave && this.state.change == false){
				let date_start = new Date(nextProps.leaves.start_date)
				let start_time = date_start.getHours()+":"+date_start.getMinutes()
				let end_date = new Date(nextProps.leaves.end_date)
				let end_time = end_date.getHours()+":"+end_date.getMinutes()
				 this.setState({
					last_updated_at:nextProps.leaves.last_updated_at,
					location:nextProps.leaves.location,
					notes:nextProps.leaves.notes,
					start_date:new Date(nextProps.leaves.start_date),
					end_date:new Date(nextProps.leaves.end_date),
					start_time:start_time,
					end_time:end_time,
					status:nextProps.leaves.status,
					transportation:nextProps.leaves.transportation,
 					return_transportation:nextProps.leaves.return_transportation,
 					type:nextProps.leaves.type,
 					host:nextProps.leaves.host

				 })
			}
		}
	}
	renderHeader(){
		const{ params,leaves } = this.props
		const btnBack = () => {
			return <button onClick={this.redirectOnStudent}  className="btn btn-md bg-principal b-round  float-right" type="button"> <i className="fa fa-arrow-left	"></i> Back</button>
		}
		if(params.id_leave && leaves){
			return <h5 className="card-title"> { "Update Leave " } {btnBack()}</h5>
		}else{
			return <h5 className="card-title">New Leave {btnBack()}</h5>
		}
	}	
	renderForms(){
		const{ leave_type,transportations, hosts } = this.props

		const[hour_start,minute_start] = this.state.start_time.split(":")
		const[hour_end,minute_end] = this.state.end_time.split(":")
		console.log(this.state)
		return(
			  <div className="card-body text-center">
			  	<div className="row">
			  		<div className="col-lg-12">
						<form style={{maxWidth:'500px',margin:'auto'}}>
						  <div className="form-group">
						    {this.renderSelect('Level Type',leave_type,'type','type',1*3)}
						  </div>
						  <div className="form-group">
						     	{this.renderSelect('Level By',transportations,'transportation','transportation',2*3)}
						  </div>
						  <div className="form-group">
						  		{this.renderSelect('Return By',transportations,'return_transportation','transportation',3*3)}
						  </div>
						  <div className="form-group date_picker_component row">
							  <div className="col-lg-6">
							  		<DayPickerInput   className="form-control" value={this.state.start_date?this.state.start_date:new Date()} onDayChange={day => this.handleChangeDate(day,"start_date")} />
							  </div>
						    	<div className="col-lg-6">
								    <TimePicker
								      time={hour_start && minute_start ? `${hour_start}:${minute_start}` : null}
								      timeMode="24" // use 24 or 12 hours mode, default 24
								      onTimeChange={(e)=>this.setTimeStart('start_time',e)}
								    />
								</div>	
						  </div>
						  <div className="form-group date_picker_component row">
						    	<div className="col-lg-6">
						    		<DayPickerInput className="form-control" value={this.state.end_date?this.state.end_date:new Date()} onDayChange={day => this.handleChangeDate(day,"end_date")} />
						    	</div>
						    	<div className="col-lg-6">
								    <TimePicker
								      time={hour_end && minute_end ? `${hour_end}:${minute_end}` : null}
								      timeMode="24" // use 24 or 12 hours mode, default 24
								      onTimeChange={(e)=>this.setTimeEnd('start_date',e)}
								    />
								</div>	
						  </div>
						  <div className="form-group">
						    	{this.renderSelect('Host',hosts,'host','host')}
						  </div>
						  <div className="form-group">
						    <input  type="text" className={this.renderClass("location")} value={this.state.location} name="location" placeholder="Destination"  onChange={this.handleChange} />
						  </div>
						  <div className="form-group">
						    <textarea placeholder="Notes" class="form-control"  rows="3" name="notes"  value={this.state.notes} onChange={this.handleChange}></textarea>
						  </div>
						  <div className="form-group">
						  	{this.renderSuccess()}
						  	{this.renderAlert()}
						  </div>
						</form>
			  		</div>
			  	</div>
			    <div className="row">
			    	<div className="col-lg-12">
			    		<div className="">
			    			{this.renderButtonActions()}
			    		</div>
			    	</div>
			    </div>
			  </div>
		)
	}
	render(){

		const{ leave_type,leaves,hosts,location }= this.props
		return(
			<div className="card m-top-default">
				{this.renderHeader()} 
			 	{leave_type && leaves && hosts && location ?  <div className="text-center loading"><Loading type='spin' color='#457eb5' delay={0}  /></div> : this.renderForms() }
			</div>
		)
	}
}

const mapStateToProps = (state,props) => {
	let leavesPselect = props.params.id_leave ? state.firebase.data.leaves ?  state.firebase.data.leaves[props.params.id_leave] : null :state.firebase.data.leaves
	return {
		student: state.firebase.data.students ?  state.firebase.data.students[props.params.id_student] : null ,
		leaves:leavesPselect,
		leave_type:state.firebase.data.leave_type,
		hosts:state.firebase.data.hosts,
		location:state.firebase.data.location,
		transportations:state.firebase.data.transportations,
	};
};

export default compose(
	 firebaseConnect((props)=>{
	 	let leaveP = props.params.id_leave ? 'leaves/'+props.params.id_leave :"leaves"
	 	return [
    	'students/'+props.params.id_student,
	 	'leave_type',
    	'hosts',
    	'location',
    	'transportations',
    	leaveP
  		]
	 })
,connect(mapStateToProps))(NewLeave)