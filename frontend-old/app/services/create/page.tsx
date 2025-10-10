import CreateServiceView from './CreateServiceView';

export const metadata = {
  title: 'Create Service | Connectly - Service Marketplace',
  description: 'Create a new service to offer on the marketplace.',
};

export default function CreateService() {
  return <CreateServiceView />;
}
