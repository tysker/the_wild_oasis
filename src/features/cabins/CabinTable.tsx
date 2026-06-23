import type { Cabin } from '../../types/cabin';
import Menus from '../../ui/Menus';
import Spinner from '../../ui/Spinner';
import Table from '../../ui/Table';
import CabinRow from './CabinRow';
import { useCabins } from './useCabins';
import { useSearchParams } from 'react-router-dom';

export const CabinTable = () => {
  const { isLoading, error, cabins } = useCabins();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  const filterValue = searchParams.get('discount') || 'all';
  const FILTERS: Record<string, (cabin: Cabin) => boolean> = {
    'no-discount': (cabin) => cabin.discount === 0,
    'with-discount': (cabin) => cabin.discount > 0,
    all: () => true,
  };

  const filteredCabins = cabins.filter(FILTERS[filterValue] ?? FILTERS.all);

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>

        <Table.Body data={filteredCabins} render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />} />
      </Table>
    </Menus>
  );
};
