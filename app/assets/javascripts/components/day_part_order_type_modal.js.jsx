var Button = app.ReactBootstrap.Button;
var Col = app.ReactBootstrap.Col;
var ControlLabel = app.ReactBootstrap.ControlLabel;
var Form = app.ReactBootstrap.Form;
var FormControl = app.ReactBootstrap.FormControl;
var FieldGroup = app.ReactBootstrap.FieldGroup;
var Modal = app.ReactBootstrap.Modal;
var OverlayTrigger = app.ReactBootstrap.OverlayTrigger;
var Tooltip = app.ReactBootstrap.Tooltip;

var Table = app.ReactBootstrap.Table;

var DayPartOrderTypeModal = React.createClass({

  propTypes: {
    create: React.PropTypes.string,
    collection: React.PropTypes.array,
    notifyParent: React.PropTypes.func,
    type: React.PropTypes.oneOf(['order_type', 'day_part'])
  },

  getInitialState: function() {
    return {
      collection: this.props.collection,
      updatedFields: {}
    };
  },

  close: function() { this.setState({ showModal: false })},
  
  create: function() {
    $('#name_field').val('');
    request = this.state.updatedFields;
    request.location_id = this.props.create;

    $.ajax({
      method: 'post',
      url: app.getUrl(location, this.props.type), 
      data: this.state.updatedFields,
      dataType: 'json',
      statusCode: {
        201: function(data) {
                new_collection = this.state.collection;
                new_collection.push(data);
                this.setState({
                  collection: new_collection,
                  updatedFields: {}
                })
                this.props.notifyParent(data);
              }.bind(this)
      }});
  },

  open: function() { this.setState({ showModal: true })},

  render: function() {
    return(
      <div>
        <div className="col-xs-2">
          <Button
            bsStyle="primary"
            bsSize="sm"
            onClick={this.open}
          >
            Manage {
              this.props.type === 'order_type' ? 'Order Types' : 'Day Parts'
            }
          </Button>
        </div>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>
              Manage {
                this.props.type === 'order_type' ? 'Order Types' : 'Day Parts'
              }
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <h5>Add {
              this.props.type === 'order_type' ? 'Order Types' : 'Day Parts'
            }</h5>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>   
                    <FormControl
                      id="name_field"
                      type="text"
                      placeholder={
                        this.props.type === 'order_type' ? 'e.g. Delivery' : 'e.g. Brunch'
                      }
                      className="input-sm"
                      onChange={this.updateNameField}
                    />      
                  </td>
                  <td>
                    <Button
                      bsStyle="success"
                      bsSize="sm"
                      onClick={this.create}
                    >Save</Button>
                  </td>
                </tr>
              </tbody>
            </Table>
            <hr />
            <h5>Remove {
              this.props.type === 'order_type' ? 'Order Types' : 'Day Parts'
            }</h5>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.collection.map(function(item) {
                    if (typeof item === 'object') {
                      return(
                        <DayPartOrderTypeRow
                          key={item.links[0].href}
                          entity={item}
                          notifyParent={this.removeFromCollection}
                        />
                      );
                    } else { return(null); }
                  }.bind(this))
                }
              </tbody>
            </Table>
          </Modal.Body>
        </Modal>
      </div>
    );
  },

  removeFromCollection: function(url) {
    this.setState({
      collection: this.state.collection.map(function(item) {
        if (typeof item === 'object') {
          if (item.links[0].href === url) {
            return;
          }
          return item;          
        }
      }.bind(this))
    });
    this.props.notifyParent();
  },

  updateNameField: function(e) {
    this.state.updatedFields.name = e.target.value;
  }
});
