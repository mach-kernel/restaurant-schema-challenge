var Button = app.ReactBootstrap.Button;

var Location = React.createClass({
  propTypes: {
    resource: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      location: this.props.resource
    };
  },

  reloadLocation: function() {
    $.ajax(this.state.location.links[0].href, {
      success: function(data) {
        this.setState({location: data});
      }.bind(this),
      error: function(err) {
        this.setState({location: undefined });
      }.bind(this)
    });
  },

  render: function() {
    if (this.state.location === undefined) {
      return(<div></div>);
    }
    else {
      return (
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">{this.state.location.name}</h3>
          </div>
          <div className="panel-body">
            <table className="table table-condensed table-responsive table-bordered table-striped">
              <thead>
                <tr>
                  <th>API Resource</th>
                  <th>Day Parts</th>
                  <th>Order Types</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.state.location.links[0].href}</td>
                  <td>{this.state.location.day_parts.length}</td>
                  <td>{this.state.location.order_types.length}</td>
                  <td>
                    <LocationModal
                      location={this.state.location}
                      notifyParent={this.reloadLocation}
                    />   
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="row">
              <DayPartOrderTypeModal
                create={this.state.location.links[0].href.split('/').pop()}
                collection={this.state.location.day_parts}
                notifyParent={this.reloadLocation}
                type='day_part'
              /> 
              <DayPartOrderTypeModal
                create={this.state.location.links[0].href.split('/').pop()}
                collection={this.state.location.order_types}
                notifyParent={this.reloadLocation}
                type='order_type'
              />
            </div>
          </div>
        </div>
      );
    }
  }
});
