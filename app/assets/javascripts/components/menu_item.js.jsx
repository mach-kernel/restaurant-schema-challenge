var Button = app.ReactBootstrap.Button;

var MenuItem = React.createClass({
  propTypes: {
    resource: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      menu_item: this.props.resource
    };
  },

  reloadMenuItem: function() {
    $.ajax(this.state.menu_item.links[0].href, {
      success: function(data) {
        this.setState({menu_item: data});
      }.bind(this),
      error: function(err) {
        this.setState({menu_item: undefined });
      }.bind(this)
    });
  },

  render: function() {
    if (this.state.menu_item === undefined) {
      return(<div></div>);
    }
    else {
      return (
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">{this.state.menu_item.name}</h3>
          </div>
          <div className="panel-body">
            <table className="table table-condensed table-responsive table-bordered table-striped">
              <thead>
                <tr>
                  <th>API Resource</th>
                  <th>Pricings</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.state.menu_item.links[0].href}</td>
                  <td></td>
                  <td>
                    <MenuItemModal
                      menu_item={this.state.menu_item}
                      notifyParent={this.reloadMenuItem}
                    />   
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }
});
