var Button = app.ReactBootstrap.Button;
var MenuItemCollection = React.createClass({
  componentWillMount: function() {
    path = location.pathname.split('/');
    path.pop();
    this.loadResources(path.pop());
  },

  getInitialState: function() {
    return {
      brand: undefined,
      menu_items: undefined
    };
  },

  onMenuItemCreate: function(new_location) {
    new_collection = this.state.menu_items;
    new_collection.push(new_location);

    this.setState({
      menu_items: new_collection
    })
  },

  loadResources: function(id) {
    var onSuccess = function(data) {
      this.setState({
        brand: data,
        menu_items: data.menu_items
      });
    }.bind(this);

    $.ajax(app.getUrl(location, 'brand') + '/' + id, {
      success: onSuccess
    });
  },

  render: function() {
    if (this.state.brand === undefined) {
      return(<div></div>);      
    }
    else {
      return(
        <div>
          <div className="row">
            <h1 className="title">{this.state.brand.name}</h1>
            <h3>Manage Menu Items</h3>
          </div>
          <div className="row">
            <div className="container">
              <div className="row">
                <Col smOffset={11} sm={1}>
                <MenuItemModal
                  menu_item={undefined}
                  notifyParent={this.onMenuItemCreate}
                  create={this.state.brand.links[0].href.split('/').pop()}
                /> 
                </Col>
              </div>
            <br />
            {
              this.state.menu_items.map(function(location) {
                if (typeof location === 'object') {
                  return <MenuItem 
                            key={location.links[0].href}
                            resource={location}
                         />                
                }
              })
            }
            </div>
          </div>
        </div>
      );    
    }
  }
});
