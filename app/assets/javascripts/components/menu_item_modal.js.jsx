var Button = app.ReactBootstrap.Button;
var Col = app.ReactBootstrap.Col;
var ControlLabel = app.ReactBootstrap.ControlLabel;
var Form = app.ReactBootstrap.Form;
var FormControl = app.ReactBootstrap.FormControl;
var FormGroup = app.ReactBootstrap.FormGroup;
var Modal = app.ReactBootstrap.Modal;
var OverlayTrigger = app.ReactBootstrap.OverlayTrigger;
var Tooltip = app.ReactBootstrap.Tooltip;

var MenuItemModal = React.createClass({

  propTypes: {
    menu_item: React.PropTypes.object,
    notifyParent: React.PropTypes.func,
    create: React.PropTypes.string
  },

  close: function() { this.setState({ showModal: false })},
  
  create: function() {
    request = this.state.updatedFields;
    request.brand_id = this.props.create;

    $.ajax({
      method: 'post',
      url: app.getUrl(location, 'menu_item'), 
      data: this.state.updatedFields,
      dataType: 'json',
      statusCode: {
        201: function(data) {
                this.props.notifyParent(data);
                this.close();
              }.bind(this)
      }});
  },

  delete: function() {
    $.ajax({
      method: 'delete',
      url: this.props.menu_item.links[0].href
    });

    this.props.notifyParent();
    this.close();
  },

  getInitialState: function() {
    return {
      showModal: false,
      updatedFields: {}
    };
  },

  open: function() { this.setState({ showModal: true })},

  render: function() {
      return(
        <div>
        <Button
          className="btn-block"
          bsStyle="primary"
          bsSize="sm"
          onClick={this.open}
        >
          {
            typeof this.props.create === 'string' ? '+' : 'Edit Properties'
          }
        </Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>
              {
                function() {
                  if (typeof this.props.create === 'string') {
                    return 'Create a Menu Item';
                  } else {
                    return 'Edit Properties: ' + this.props.menu_item.name;
                  }                  
                }.bind(this)()
              }
            </Modal.Title>
          </Modal.Header>

          <Form horizontal>
            <Modal.Body>
              <FormGroup controlId="menu_itemName">
                <Col componentClass={ControlLabel} sm={1}>
                  Name
                </Col>
                <Col smOffset={7} sm={4}>
                  <FormControl 
                    type="text"
                    placeholder={
                      function() {
                        if (typeof this.props.create === 'string') {
                          return 'e.g. Green Curry';
                        } else {                      
                          return this.props.menu_item.name;
                        }
                      }.bind(this)()
                    }
                    onChange={this.updateNameField}
                  />
                </Col>
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={this.close}
                bsStyle="default"
              >Close</Button>
              <Button
                onClick={
                  function() {
                    return typeof this.props.create === 'string' ? this.create : this.save;
                  }.bind(this)()
                }
                bsStyle="success"
              >Save</Button>
              {
                function() {
                  if (!(typeof this.props.create === 'string')) {
                    return(
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="modal-tooltip">
                            You <strong>cannot</strong> undo this.
                          </Tooltip>
                        }
                        placement="top"
                      >
                        <Button
                          onClick={this.delete}
                          bsStyle="danger"
                        >Delete</Button>
                      </OverlayTrigger>                    
                    );
                  }
                }.bind(this)()
              }
            </Modal.Footer>
          </Form>
        </Modal>
        </div>
      );    
  },

  save: function() {
    $.ajax({
      method: 'put',
      url: this.props.menu_item.links[0].href,
      data: this.state.updatedFields
    });

    this.props.notifyParent();
    this.close();
  },

  updateNameField: function(e) {
    this.setState({updatedFields: {name: e.target.value}});
  }
});
