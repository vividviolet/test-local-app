import createAppWrapper from '@shopify/easdk';
import {
  ButtonGroup,
  Button,
  Flash,
  Modal,
  TitleBar,
} from '@shopify/easdk/actions';

function openModal(size?: Modal.Size) {
  // Create buttons
  const okButton = Button.create(app, { label: 'Ok', primary: true });
  const updateOkLabelButton = Button.create(app, {
    label: 'Update Ok Button Label',
  });
  const modal = Modal.create(app, {
    size,
    footer: {
      buttons: { primary: okButton, secondary: [updateOkLabelButton] },
    },
    message: 'My content comes from the Embedded App',
    title: "I'm a modal opened by the Embedded App",
  });

  // Subscribe to button actions
  okButton.subscribe('click', (payload?: any) => {
    console.info(
      '[client] Received button click action from "Ok" button with payload: %o',
      payload
    );
    modal.dispatch(Modal.Action.CLOSE);
  });

  updateOkLabelButton.subscribe(Button.Action.CLICK, () => {
    okButton.set({
      label: okButton.options.label === 'Ok' ? 'New label' : 'Ok',
    });
  });

  // Subscribe to modal actions
  modal.subscribe('close', () => {
    console.info('[client] Received close modal action from specific modal');
    modal.unsubscribe();
  });

  modal.subscribe('open', () => {
    console.info('[client] Received open modal action from specific modal');
  });

  // Open modal
  modal.dispatch(Modal.Action.OPEN);
}

const createApp = createAppWrapper(window.top);
const app = createApp({
  apiClientId: '12345',
});

const groupedButton1 = Button.create(app, { label: 'Show flash message' });
const groupedButton2 = Button.create(app, { label: 'Open Modal' });

groupedButton1.subscribe(Button.Action.CLICK, () => {
  app.dispatch(Flash.show({ message: 'Hello!', duration: 3000 }));
});

groupedButton2.subscribe('click', () => {
  openModal();
});

const primary = Button.create(app, { label: 'Save' });

primary.subscribe(Button.Action.CLICK, () => {
  app.dispatch(Flash.show({ message: 'Clicked save', duration: 3000 }));
});

const secondaryMoreButton = ButtonGroup.create(app, {
  buttons: [groupedButton1, groupedButton2],
  label: 'More actions',
});

const secondary = [secondaryMoreButton];

TitleBar.create(app, {
  buttons: {
    primary,
    secondary,
  },
  title: 'Page Name',
});

const container = document.createElement('div');

container.innerText = "I'm an embedded app!";

document.body.appendChild(container);
