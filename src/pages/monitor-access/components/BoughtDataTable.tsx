import { Starred } from '@components/form';
import { Link } from 'react-router-dom';
import CustomTable, { ITableColumns } from '@components/ui/CustomTable';
import useAuth from '@shared/hooks/useAuth';
import CustomButton from '@components/ui/Button';
import dayjs from 'dayjs';
import { useGetOutgoingPermissionsQuery } from '@store/monitor-access/api';

const COLUMNS: ITableColumns[] = [
  {
    header: 'Name',
    cell: (item) => (
      <Link
        to={`/data/${item.item_hash}/details`}
        className="text-blue whitespace-nowrap"
      >
        {item.name}
      </Link>
    ),
    sortWith: 'name',
  },
  {
    header: 'DESCRIPTION',
    cell: (item) => '',
    sortWith: 'item',
  },
  {
    header: 'SELLER',
    cell: (item) => '',
    sortWith: 'item',
  },
  {
    header: 'DATE',
    cell: ({ timestamp }) => (
      <p className="whitespace-nowrap">
        {dayjs.unix(timestamp).format('YYYY-MM-DD HH:MM')}
      </p>
    ),
    sortWith: 'timestamp',
  },
  {
    header: 'PRICE',
    cell: (item) => '',
    //@todo
    sortWith: 'item',
  },
  {
    header: '',
    //@todo
    cell: (item) => <Starred starred={item.forgotten} />,
  },
  {
    header: '',
    cell: () => (
      <CustomButton
        text="Download"
        icon="download"
        btnStyle="outline-primary"
      />
    ),
  },
];

const BoughtDataTable = () => {
  const auth = useAuth();

  const { data, isLoading } = useGetOutgoingPermissionsQuery({
    address: auth?.address,
  });

  return <CustomTable data={data} columns={COLUMNS} isLoading={isLoading} />;
};

export default BoughtDataTable;
