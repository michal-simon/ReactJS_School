import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { Link } from 'react-router-dom'
import App              from './components/App.jsx';
import Index              from './components/data/Index.jsx';
import Login              from './components/Login.jsx';
import StudentProfile     from './components/wave_management/profile/ProfileDetails.jsx';
import FacultyProfile 	  from './components/wave_management/profile/FacultyStudentProfile.jsx';
import FacultyMyProfile 	  from './components/wave_management/profile/FacultyProfile.jsx';
import Search 	  			from './components/wave_management/Search.jsx';
import NewRoster 	  			from './components/wave_management/roster/NewRoster.jsx';
import ListRoster 	  			from './components/wave_management/roster/RosterList.jsx';
import RosterDetails 	  		from './components/wave_management/roster/RosterDetails.jsx';
import StudentLeaves 	  		from './components/wave_management/leaves/StudentLeaves.jsx';
import NewLeave 	  			from './components/wave_management/leaves/NewLeave.jsx';
import LeaveDetails 	  		from './components/wave_management/leaves/LeaveDetails.jsx';


import NotAuthorized 	from './components/NotAuthorized.js';
import NotFound 		from './components/NotFound.js';


//import registerServiceWorker from './registerServiceWorker';

/******************************
*		GLOBAL VARIABLES
*		HOST,LANGUAGE,ECT
******************************/
window.basepath ='/wave';

window.globalconf ={

	language:{
		en:{},
		it:{},
		instance:'it'
	}
}


const hostname 	= window.location.hostname;

window.maggiore = {
	hosts:{
			development:'',
			production:''
	}
}
if(hostname=="localhost"){	
	
}else{
	window.host = window.location.protocol + "//" +  hostname;
}

window.apiPrefix	= "";
window.url_prefix = window.host+window.apiPrefix;


const pathWeb = window.basepath == "/" ? "" : window.basepath;

console.log("pathWeb",pathWeb)

export default function getRoutes(store,tr) {

  const callbackOnleave = () => {

	store.dispatch({
		type: 'CLEAR_MESSAGES'
	});
  };
  
  return (
	
	<Route>
		<Route path={pathWeb} component={App}>
			<Route path={ pathWeb + "/" } component={Search} onLeave={callbackOnleave} />
			<Route path={ pathWeb + "/index" } component={Index} onLeave={callbackOnleave} />
			<Route path={ pathWeb + "/search" } component={Search} onLeave={callbackOnleave} />
			<Route path={ pathWeb + "/newroster(/:id)" }  component={NewRoster} onLeave={callbackOnleave} />
			<Route path={ pathWeb + "/listroster"} component={ListRoster} onLeave={callbackOnleave} />
			<Route path={ pathWeb + "/rosterdetails/:id" } component={RosterDetails} onLeave={callbackOnleave} />
			<Route path={ pathWeb + "/studentleaves/:id_student"} component={StudentLeaves} onLeave={callbackOnleave} />
			<Route path={ pathWeb + "/leavedetails/:id_student/:id_leave"}  component={LeaveDetails} onLeave={callbackOnleave} />
			<Route path={ pathWeb + "/NewLeave/:id_student(/:id_leave)"} component={NewLeave} onLeave={callbackOnleave} />
			<Route path={ pathWeb + "/login"} component={Login} onLeave={callbackOnleave} />
			<Route path={ pathWeb + "/s-profile/:id"}   component={StudentProfile} onLeave={callbackOnleave} />
			<Route path={ pathWeb + "/faculty-s-profile/:id_student"}  component={FacultyProfile} onLeave={callbackOnleave} />
			<Route path={ pathWeb + "/f-my-profile/:id_faculty"}  component={FacultyMyProfile} onLeave={callbackOnleave} />
			<Route path={ pathWeb + "/noauthorize"} component={NotAuthorized} onLeave={callbackOnleave} />
			<Route path={ pathWeb + "/noauthorize"} component={NotAuthorized} onLeave={callbackOnleave} />
			<Route path={ pathWeb + "/notfound"} component={NotFound} onLeave={callbackOnleave} />
			<Route path="*" component={NotFound} onLeave={callbackOnleave} />
		</Route>
    </Route>
  );
}
