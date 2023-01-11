/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/member-delimiter-style */
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Tab, Tabs, Typography } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { styled } from '@mui/system';

import GeneralTab from './GeneralTab';

export const CustomButton = styled(Button)({
  fontSize: '14px',
  textTransform: 'none',
  boxShadow: '0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)',
  color: '#333',
  minWidth: '64px',
  lineHeight: '36px',
  padding: '0 16px',
  fontWeight: 'normal',
});

const TabHeader = styled(Tab)({
  textTransform: 'none',
  fontWeight: 'normal',
  padding: '12px 22px',
  '&.Mui-selected': {
    color: '#f24b50',
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps): JSX.Element {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

interface ModalProjectForm {
  name: string;
  customerId: number | undefined;
  code: string;
  timeStart: string;
  timeEnd: string;
  isAllUserBelongTo?: boolean;
  isNotifyToKomu?: boolean;
  komuChannelId?: string;
  status?: number;
  projectType: number;
  users: { userId: number; type: number }[];
  note?: string;
  id?: number;
  task: { taskId: number; billable: boolean }[];
}

interface ModalProjectProps {
  setOpenModalProject: Function;
  openModalProject: boolean;
  title?: string;
}

const schema = yup
  .object({
    name: yup.string().required('Project name is required!'),
    customerId: yup.string().required('Project customer is required!'),
    code: yup.string().required('Project code is required!'),
    projectType: yup.number().required(),
    users: yup.array().required(),
  })
  .required();

function ModalProject({ setOpenModalProject, openModalProject, title }: ModalProjectProps): JSX.Element {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<ModalProjectForm>({
    mode: 'all',
    resolver: yupResolver(schema),
  });
  const onSubmit: SubmitHandler<ModalProjectForm> = (data) => {
    setOpenModalProject(false);
    console.log(data);
    // setValue('name', '', { shouldValidate: false });
  };

  // Handle Tab Display
  const [valueTab, setValueTab] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number): void => {
    setValueTab(newValue);
  };
  const handleCLoseModalProject = (): void => {
    setOpenModalProject(false);
    setValue('customerId', undefined, { shouldValidate: false });
  };

  return (
    <Dialog
      open={openModalProject}
      onClose={handleCLoseModalProject}
      sx={{
        '& .MuiPaper-root': {
          padding: '12px 24px',
          width: '1200px',
          maxWidth: '80vw',
        },
      }}
    >
      <DialogTitle
        sx={{
          mb: '10px',
          fontWeight: '800',
          fontSize: '30px',
          padding: '0 0 10px 0',
          borderBottom: '1px solid #eee',
        }}
      >
        {title}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <DialogContent sx={{ padding: '0', width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={valueTab}
              onChange={handleChange}
              aria-label="basic tabs example"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: '#f24b50',
                },
              }}
            >
              <TabHeader label="General" />
              <TabHeader label="Team" />
              <TabHeader label="Tasks" />
              <TabHeader label="Notification" />
            </Tabs>
          </Box>
          <TabPanel value={valueTab} index={0}>
            <GeneralTab errors={errors} register={register} />
          </TabPanel>
          <TabPanel value={valueTab} index={1}>
            Team
          </TabPanel>
          <TabPanel value={valueTab} index={2}>
            Tasks
          </TabPanel>
          <TabPanel value={valueTab} index={3}>
            Notification
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleCLoseModalProject}>Cancel</CustomButton>
          <CustomButton
            type="submit"
            sx={{
              color: '#fff',
              backgroundColor: '#f24b50',
              '&:hover': {
                backgroundColor: '#f24b50',
              },
            }}
            disabled={errors.customerId ? true : false}
          >
            Save
          </CustomButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ModalProject;
