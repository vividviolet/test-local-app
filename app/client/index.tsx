import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';
import {
  AppProvider,
  Page,
  Modal,
  Loading,
  Toast,
  ResourcePicker,
  Card,
  Layout,
  DescriptionList,
} from '@shopify/polaris';
import { Redirect } from '@shopify/app-bridge/actions';
import { ResourceSelection } from '@shopify/app-bridge/actions/ResourcePicker';
import '@shopify/polaris/styles.css';

interface State {
  modalOpen: boolean;
  modalContent?: string;
  saveEnabled: boolean;
  loading: boolean;
  toastContent?: string;
  resourcePickerOpen: boolean;
  selectedProducts?: ResourceSelection[];
}

export class App extends React.PureComponent<any, State> {
  static contextTypes = {
    polaris: PropTypes.object,
  };

  state: State = {
    modalOpen: false,
    modalContent: undefined,
    saveEnabled: false,
    loading: false,
    toastContent: undefined,
    resourcePickerOpen: false,
    selectedProducts: undefined,
  };

  redirectToSection(section: Redirect.ResourceType) {
    const redirect = Redirect.create(this.context.polaris.appBridge);
    redirect.dispatch(Redirect.Action.ADMIN_SECTION, { name: section });
  }

  openModal(modalContent: string) {
    this.setState({ modalOpen: true, modalContent });
  }

  toggleLoading() {
    this.setState({ loading: !this.state.loading });
  }

  toastMessage(toastContent: string) {
    this.setState({ toastContent: toastContent });
  }

  openProductPicker() {
    this.setState({ resourcePickerOpen: true });
  }

  render() {
    const {
      loading,
      modalContent,
      modalOpen,
      saveEnabled,
      toastContent,
      resourcePickerOpen,
      selectedProducts,
    } = this.state;

    const loadingMarkup = loading && <Loading />;

    const toastMarkup = toastContent && (
      <Toast
        content={toastContent}
        onDismiss={() => {
          console.log('dismissed');
          this.setState({ toastContent: undefined });
        }}
      />
    );

    const resourcePickerMarkup = (
      <ResourcePicker
        resourceType="Product"
        open={resourcePickerOpen}
        onSelection={({ selection }) => {
          this.setState({
            resourcePickerOpen: false,
            selectedProducts: selection as ResourceSelection[],
          });
        }}
        onCancel={() => this.setState({ resourcePickerOpen: false })}
      />
    );

    const modalMarkup = modalContent ? (
      <Modal
        open={modalOpen}
        title="Share on social media"
        primaryAction={{
          content: 'Ok',
          onAction: () =>
            this.setState({ modalOpen: false, saveEnabled: true }),
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () =>
              this.setState({ modalOpen: false, saveEnabled: false }),
          },
        ]}
        onClose={() => this.setState({ modalOpen: false })}
        message={modalContent}
      />
    ) : null;

    const products = selectedProducts
      ? selectedProducts.map(product => ({
          term: (product as any).title || '',
          description: JSON.stringify(product),
        }))
      : [];

    return (
      <Page
        breadcrumbs={[
          {
            content: 'Products',
            onAction: () =>
              this.redirectToSection(Redirect.ResourceType.Product),
          },
        ]}
        title="Product reviews"
        primaryAction={{
          content: 'Save',
          disabled: !saveEnabled,
          onAction: () => {
            this.setState({ saveEnabled: false });
            this.toastMessage('Saved!');
          },
        }}
        secondaryActions={[
          {
            content: 'Show toast',
            onAction: () => this.toastMessage('Hi there!'),
          },
          { content: 'Toggle loading', onAction: () => this.toggleLoading() },
          {
            content: 'Product picker',
            onAction: () => this.openProductPicker(),
          },
        ]}
        actionGroups={[
          {
            title: 'Go to',
            actions: [
              {
                content: 'Customers',
                onAction: () =>
                  this.redirectToSection(Redirect.ResourceType.Customer),
              },
              {
                content: 'Discounts',
                onAction: () =>
                  this.redirectToSection(Redirect.ResourceType.Discount),
              },
            ],
          },
          {
            title: 'Promote',
            actions: [
              {
                content: 'Share on Facebook',
                onAction: () => this.openModal('share on fb'),
              },
              {
                content: 'Share on Pinterest',
                onAction: () => this.openModal('share on pinterest'),
              },
            ],
          },
        ]}
      >
        <Layout.AnnotatedSection title="My Polaris App" />
        <Layout>
          <Layout.Section>
            <Card title="Selected products" sectioned>
              <DescriptionList items={products} />
            </Card>
          </Layout.Section>
        </Layout>

        {modalMarkup}
        {resourcePickerMarkup}
        {toastMarkup}
        {loadingMarkup}
      </Page>
    );
  }
}

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(
  <AppProvider apiKey="app_bridge_key" shopOrigin="shop1.myshopify.io">
    <App />
  </AppProvider>,
  root
);
