let record =
{
    "id": "3",
    "start_date": "2018-8-9",
    "end_date": "2018-12-28",
    "rent": 510,
    "frequency": "monthly",
    "payment_day": "tuesday"
}

const day =
{
    "monday": 0,
    "tuesday": 1,
    "wednesday": 2,
    "thursday": 3,
    "friday": 4,
    "saturday": 5,
    "sunday": 6,
}

function recordList(record) {
    let recordlist = [];
    let startdate = parseDate(record.start_date);
    let enddate = parseDate(record.end_date);
    Object.freeze(day);
    Object.freeze(record);

    for (let i = new Date(startdate); i <= enddate; i.setDate(i.getDate() + 1)) {
        if (i.getDay() == day[record.payment_day]) {

            recordlist.push([startdate, new Date(i)]);
            i.setDate(i.getDate() + 1);
            startdate = new Date(i);
            //s1 = i.toDateString();
            if (record.frequency === "fortnightly") {
                i.setDate(i.getDate() + 12);
            }
            else if (record.frequency === "weekly") {
                i.setDate(i.getDate() + 5);
            }
            else if (record.frequency === "monthly") {
                i.setDate(i.getDate() + 26);
            }
        }
    }

    if (startdate <= enddate)
        recordlist.push([startdate, enddate]);

    for (let i = 0; i < recordlist.length; i++) {
        let days = daysBetween(recordlist[i][0], recordlist[i][1]) + 1;
        recordlist[i].push(days, record.rent / 7 * days);
    }
    return recordlist;
}

function treatAsUTC(date) {
    let result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}

function daysBetween(startDate, endDate) {
    let millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
}


function parseDate(input) {
    var parts = input.split('-');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1] - 1, parts[2]); // Note: months are 0-based
}

function Test(props)
{
	if (props.record.length != 0)
	{
		let para = (Object.getOwnPropertyNames(props.obj).map((item, index) =>
            <tr key={index}>
                <td key={item + "" + index}>{item.replace('_', '-')}</td>
                <td key={props.obj[item] + "" + index}>{props.obj[item]}</td>
            </tr>)
        );
		
		let table = props.record.map((item, index) =>
            <tr key={index}>
                <td key={index + "" + 0}>{item[0].toDateString()}</td>
                <td key={index + "" + 1}>{item[1].toDateString()}</td>
                <td key={index + "" + 2}>{item[2]}</td>
                <td key={index + "" + 3}>{"$"+item[3].toFixed(1)}</td></tr>);
				
		
		return  <div>
				<p>This is the summary of your lease</p>
				<table border="1 px solid">
                    <tbody>
                        {para}
                    </tbody>
                </table>
				<p>This is the payments of your lease</p>
                <table border="1">
                    <tbody>
						<tr>
							<th>From</th>
							<th>To</th>
							<th>Days</th>
							<th>Amount</th>
						</tr>
                        {table}
                    </tbody>
                </table>
				</div>
	}
	return null;
	
}

class DisplayRecord extends React.Component {
    constructor(props) {
        super(props);
        this.state =
            {
                value: '',
                records: [],
                records2: {},
                error: null,
				validate: false
            };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
		
    }

    handleSubmit(event) {
        fetch('https://hiring-task-api.herokuapp.com/v1/leases/' + this.state.value)
            .then(response => {
                if (response.ok && this.state.value.match(/\W/) === null && this.state.value.length != 0) {
                    return response.json();
                } else {
                    throw new Error('The system cannot found the lease record according to the id you have entered.');
                }
            }
            )
            .then(data => {
				
                this.setState({ records: recordList(data), records2: data, error: false }
                )
            }).catch(error => {this.setState({ error: true })});

        event.preventDefault();

    }

	InputForm()
	{
		return <form onSubmit={this.handleSubmit}>
                    <label>
                        Lease id:
          <input type="text" value={this.state.value} onChange={this.handleChange} required pattern="[a-zA-Z0-9]+" maxLength="8" />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
	}
	
    render() {
        if (this.state.error) {
            return <div>
                {this.InputForm()}
                <p>The id You've entered is invalid</p>
            </div>


        }
		else
		{
        return (

            <div>
			
			{this.InputForm()}
				<Test record={this.state.records} obj={this.state.records2}/>
            </div>
        );
		}

        
    }
}

ReactDOM.render(<DisplayRecord />, document.getElementById('root'));
