import TextInput from '@components/form/TextInput';
import AppModal from '@components/ui/AppModal';
import Button from '@components/ui/Button';
import AddressWrap from '@shared/components/AddressWrap';
import ClickToCopy from '@shared/components/ClickToCopy';
import { ExecutePrompt } from '@shared/components/Prompts';
import DataSummary from '@shared/components/Summary';
import ViewLoader from '@shared/components/ViewLoader';
import useAuth from '@shared/hooks/useAuth';
import useOwner from '@shared/hooks/useOwner';
import { useAppDispatch, useAppSelector } from '@shared/hooks/useStore';
import {
  changeDatasetPermissionInput,
  requestDatasetPermissions,
} from '@slices/monitorAccessSlice';
import dayjs from 'dayjs';
import { IoCheckbox } from 'react-icons/io5';
import { RxCaretLeft } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';
import TimeseriesCharts from './components/TimeseriesCharts';
import useDataDetails from './hooks/useDataDetails';

const DataDetails = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const { requestDatasetPermissionActions } = useAppSelector(
    (state) => state.monitorAccess
  );
  const {
    handleOnChange,
    isPublished,
    handleUploadDataset,
    isLoading,
    publishedModalProps,
    dataDetails,
    datasetByIDActions,
    handleUpdateDataset,
    updateDatasetsActions,
  } = useDataDetails();
  const { isOwner } = useOwner(dataDetails?.owner);
  const { isOpen, handleClose } = publishedModalProps;

  const summary = [
    {
      name: 'Hash of the data',
      value: (
        <div className="flex items-center gap-[11px]">
          <p className="w-[200px] truncate">{dataDetails?.item_hash || ''}</p>
          <ClickToCopy text={dataDetails?.item_hash} />
        </div>
      ),
    },
    {
      name: 'Creation date',
      value: (
        <p>
          {dayjs
            .unix(dataDetails?.timestamp || Date.now() / 1000)
            .format('DD/MM/YYYY')}
        </p>
      ),
    },
    {
      name: 'Downloads',
      value: <p> {dataDetails?.desc} </p>,
    },
    {
      name: 'Total Sold',
      value: <p> {dataDetails?.desc} USDC </p>,
    },
    {
      name: 'Current Price',
      value: <p> {dataDetails?.desc} USDC </p>,
    },
    {
      name: 'Owner',
      value: <AddressWrap hash={dataDetails?.owner} />,
    },
    // {
    //   name: 'Usages',
    //   value: dataDetails?.current_revision || 0,
    // },
  ];

  const disabled = !isOwner;

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div>
          <Link to="/data" className="flex items-center text-blue">
            <RxCaretLeft size={30} />
            Published
          </Link>
        </div>
        <div>
          {/* eslint-disable-next-line no-nested-ternary */}
          {isPublished ? (
            isOwner ||
            dataDetails?.available ||
            dataDetails?.permission_status === 'GRANTED' ? (
              <div className="flex gap-4">
                <ExecutePrompt
                  btnSize="md"
                  against="algorithm"
                  selectedHash={dataDetails?.item_hash}
                />
                {isOwner ? (
                  <Button
                    text="Save"
                    size="md"
                    isLoading={updateDatasetsActions.isLoading}
                    onClick={handleUpdateDataset}
                  />
                ) : null}
              </div>
            ) : (
              <Button
                text="Access request"
                size="md"
                onClick={() => {
                  dispatch(
                    changeDatasetPermissionInput({
                      input: 'requestor',
                      value: auth.address,
                    })
                  );
                  dispatch(requestDatasetPermissions(dataDetails?.item_hash));
                }}
                isLoading={
                  dataDetails?.permission_status === 'REQUESTED' ||
                  requestDatasetPermissionActions.isLoading
                }
              />
            )
          ) : (
            <Button
              text="Publish"
              size="md"
              isLoading={isLoading}
              onClick={() => {
                handleUploadDataset();
              }}
            />
          )}
        </div>
      </div>
      <div className="relative">
        <ViewLoader isLoading={datasetByIDActions.isLoading} />
        <div className="grid grid-cols-2 gap-5 mb-5">
          <div className="bg-form-bg flex flex-col gap-4 p-6 text-text-dark rounded-[32px]">
            <TextInput
              label="Data name"
              placeholder="Name the data"
              value={dataDetails?.name || ''}
              onChange={(e) => handleOnChange('name', e.target.value)}
              fullWidth
              disabled={disabled}
            />
            <TextInput
              label="Set price in USDC"
              placeholder="Enter the price"
              value={dataDetails?.price || ''}
              onChange={(e) => handleOnChange('price', e.target.value)}
              fullWidth
              inputType
              size="sm"
              disabled={disabled}
            />
            <TextInput
              label="Description"
              placeholder="What is the data about?"
              value={dataDetails?.desc || ''}
              onChange={(e) => handleOnChange('desc', e.target.value)}
              fullWidth
              disabled={disabled}
            />
          </div>
          <DataSummary summary={summary} />
        </div>
        <TimeseriesCharts isOwner={isOwner} />
      </div>
      <AppModal
        isOpen={isOpen}
        handleClose={handleClose}
        withInfo
        withHeader={false}
      >
        <div className="flex flex-col items-center gap-4">
          <h1>Data {!isPublished ? 'published' : 'updated'}!</h1>
          <IoCheckbox className="text-blue" size={70} />
          <p>
            {dataDetails?.name || ''} {!isPublished ? 'published' : 'updated'}
          </p>
          <div className="flex flex-col items-center gap-2">
            <p className="text-blue w-[400px] truncate select-none">
              {dataDetails?.item_hash || ''}
            </p>
            <ClickToCopy text={dataDetails?.item_hash || ''} color="#1DC3CF" />
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-7">
          <Button
            text="Edit data"
            size="lg"
            btnStyle="outline-blue"
            fullWidth
            onClick={() => {
              navigate(`/data/${dataDetails?.item_hash}/details`);
              handleClose();
            }}
          />
          <Button
            text="Home"
            size="lg"
            fullWidth
            onClick={() => navigate('/data')}
          />
        </div>
      </AppModal>
    </div>
  );
};

export default DataDetails;
