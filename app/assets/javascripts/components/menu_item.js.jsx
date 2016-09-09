var Button = app.ReactBootstrap.Button;

var MenuItem = React.createClass({
  propTypes: {
    resource: React.PropTypes.object
  },

  // TODO: What the fuck?!
  getInitialState: function() {
    return {};
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

    this.fetchLocations();
  },

  fetchLocations: function() {
    resource = (this.state.menu_item === undefined) ? this.props.resource : this.state.menu_item;
    $.ajax(resource.links[1].href, {
      success: function(data) {
        this.setState({
          menu_item: resource,
          locations: data.locations
        })
      }.bind(this)
    });
  },

  componentDidMount: function() {
    this.fetchLocations();
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
                  <td>{this.state.menu_item.price_levels.length}</td>
                  <td>
                    <MenuItemModal
                      menu_item={this.state.menu_item}
                      notifyParent={this.reloadMenuItem}
                    />   
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="row">
              <PriceLevelModal
                price_levels={this.state.menu_item.price_levels}
                locations={this.state.locations}
                parentId={this.state.menu_item.links[0].href.split('/').pop()}
                notifyParent={this.reloadMenuItem}
              />  
            </div>
          </div>
        </div>
      );
    }
  }
});
