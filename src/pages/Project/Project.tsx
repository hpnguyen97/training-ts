/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Popover, Button, Grid, TextField, InputAdornment, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import { ClipLoader } from 'react-spinners';

import { Wrapper } from 'src/pages/Task/Task';
import { useAppDispatch, useAppSelector } from 'src/hooks/useTypedSeletor';
import {
  ProjectForm,
  getAllProjects,
  getAllProjectsActive,
  getAllProjectsDeactive,
  GetQuantityProjects,
  GetAllCustomers,
} from 'src/redux/projectSlice';
import { getAllTasks } from 'src/redux/taskSlice';
import { getUserNotPagging } from 'src/redux/userSlice';
import SingleProject from 'src/components/Project/SingleProject';
import useDebounce from 'src/hooks/useDebounce';
import ModalProject from 'src/components/Project/ModalProject';

const QuantityButton = styled(Button)({
  textTransform: 'none',
  color: '#333',
  fontWeight: 'normal',
  width: '100%',
  justifyContent: 'flex-start',
  padding: '10px 8px 10px 12px',
});

export const CustomAddButton = styled(Button)({
  backgroundColor: '#f24b50',
  textTransform: 'none',
  fontWeight: 'normal',
  padding: '13px 30px',
  color: '#fff',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: '#f24b50',
  },
  boxShadow: '0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)',
});

function Project(): JSX.Element {
  const [openModalProject, setOpenModalProject] = useState(false);
  const [quantityActiveProjects, setQuantityActiveProjects] = useState<
    { status: number; quantity: number } | undefined
  >(undefined);
  const [quantityDeactiveProjects, setQuantityDeactiveProjects] = useState<
    { status: number; quantity: number } | undefined
  >(undefined);
  const [searchValue, setSearchValue] = useState<string>('');
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllProjectsActive(''));
    dispatch(GetQuantityProjects());
    dispatch(GetAllCustomers());
  }, []);

  const { quantityProjects, allProjects, allProjectsActive, allProjectsDeactive } = useAppSelector(
    (state) => state.project.data
  );

  const { loadingAllProjects, loadingAllProjectsActive, loadingAllProjectsDeactive, loadingQuantityProjects } =
    useAppSelector((state) => state.project.loading);

  // handle arrange projects by customer name
  const [arrangeProjects, setArrangeProjects] = useState<arrangeProjectsType[]>([]);
  interface arrangeProjectsType {
    customerName: string;
    status: number;
    data: ProjectForm[];
  }
  const handleArrangeProject = (arrayProjects: ProjectForm[]): void => {
    const prevArrangeProjects: arrangeProjectsType[] = [];
    arrayProjects.forEach((project) => {
      const existProject: arrangeProjectsType | undefined = prevArrangeProjects.find(
        (arrangeProject) => arrangeProject.customerName === project.customerName
      );
      if (!existProject) {
        prevArrangeProjects.push({ customerName: project.customerName, status: project.status, data: [project] });
      } else {
        const index = prevArrangeProjects.indexOf(existProject);
        existProject.data.push(project);
        prevArrangeProjects.splice(index, 1, existProject);
      }
    });
    setArrangeProjects(prevArrangeProjects);
  };
  useEffect(() => {
    if (allProjectsActive?.length > 0) {
      handleArrangeProject(allProjectsActive);
    }
    if (allProjectsDeactive?.length > 0) {
      handleArrangeProject(allProjectsDeactive);
    }
    if (allProjects?.length > 0) {
      handleArrangeProject(allProjects);
    }
  }, [allProjects, allProjectsActive, allProjectsDeactive]);

  // handle Quantity Projects
  useEffect(() => {
    if (quantityProjects) {
      setQuantityActiveProjects(quantityProjects.find((project) => project.status === 0));
      setQuantityDeactiveProjects(quantityProjects.find((project) => project.status === 1));
    }
  }, [quantityProjects]);

  // Handle Search by client or project name
  const debouncedValue: string = useDebounce(searchValue, 600);
  useEffect(() => {
    let newAllProjects: ProjectForm[] = [];

    if (allProjectsActive?.length > 0) {
      if (debouncedValue.trim()) {
        newAllProjects = allProjectsActive.filter(
          (project: ProjectForm) =>
            project.customerName?.includes(debouncedValue.trim()) || project.name?.includes(debouncedValue.trim())
        );
        handleArrangeProject(newAllProjects);
      } else {
        handleArrangeProject(allProjectsActive);
      }
    }
    if (allProjectsDeactive?.length > 0) {
      if (debouncedValue.trim()) {
        newAllProjects = allProjectsDeactive.filter(
          (project: ProjectForm) =>
            project.customerName?.includes(debouncedValue.trim()) || project.name?.includes(debouncedValue.trim())
        );
        handleArrangeProject(newAllProjects);
      } else {
        handleArrangeProject(allProjectsDeactive);
      }
    }
    if (allProjects?.length > 0) {
      if (debouncedValue.trim()) {
        newAllProjects = allProjects.filter(
          (project: ProjectForm) =>
            project.customerName?.includes(debouncedValue.trim()) || project.name?.includes(debouncedValue.trim())
        );
        handleArrangeProject(newAllProjects);
      } else {
        handleArrangeProject(allProjects);
      }
    }
  }, [debouncedValue]);

  // Refresh button
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const handleClickRefresh = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseRefresh = (): void => {
    setAnchorEl(null);
  };
  const openRefresh = Boolean(anchorEl);
  const handleRefresh = (): void => {
    if (allProjectsActive?.length > 0) {
      dispatch(getAllProjectsActive(''));
    }
    if (allProjectsDeactive?.length > 0) {
      dispatch(getAllProjectsDeactive(''));
    }
    if (allProjects?.length > 0) {
      dispatch(getAllProjects(''));
    }
    dispatch(GetQuantityProjects());
    setAnchorEl(null);
  };

  return (
    <Wrapper>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '5px 6px 5px 15px',
          borderBottom: '1px solid rgba(204, 204, 204, 0.35)',
          color: '#333',
        }}
      >
        <Typography fontSize="18px" sx={{ lineHeight: '18px' }}>
          Manage Projects
        </Typography>
        <Box>
          <IconButton
            sx={{
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
            onClick={handleClickRefresh}
          >
            <MoreVertIcon />
          </IconButton>
          <Popover
            open={openRefresh}
            anchorEl={anchorEl}
            onClose={handleCloseRefresh}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <Button
              startIcon={<RefreshIcon />}
              sx={{
                backgroundColor: '#fff',
                color: '#333',
                textTransform: 'none',
                borderRadius: '4px',
                boxShadow:
                  '0 2px 4px -1px rgb(0 0 0 / 20%), 0 4px 5px 0 rgb(0 0 0 / 14%), 0 1px 10px 0 rgb(0 0 0 / 12%)',
                padding: '10px 16px',
                fontWeight: 'normal',
              }}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </Popover>
        </Box>
      </Box>
      <Box sx={{ padding: '20px', color: '#555' }}>
        <Grid container spacing={2}>
          <Grid item xs={3} sx={{ textAlign: 'left' }}>
            <CustomAddButton
              startIcon={<AddIcon />}
              onClick={() => {
                setOpenModalProject(true);
                dispatch(getAllTasks());
                dispatch(getUserNotPagging());
              }}
            >
              New Project
            </CustomAddButton>
            <ModalProject
              setOpenModalProject={setOpenModalProject}
              openModalProject={openModalProject}
              title="Create Project"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              sx={{
                width: '100%',
                '& .MuiSelect-select': {
                  padding: '6px 0 6px',
                },
                '& .MuiButton-root': {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block',
                  textAlign: 'left',
                },
                '& .MuiButton-root:hover': {
                  backgroundColor: '#fff',
                },
              }}
              defaultValue="0"
            >
              <MenuItem value="0" sx={{ padding: 0 }}>
                <QuantityButton
                  onClick={() => {
                    dispatch(getAllProjectsActive(''));
                    dispatch(GetQuantityProjects());
                  }}
                >{`Active Projects (${quantityActiveProjects?.quantity})`}</QuantityButton>
              </MenuItem>
              <MenuItem
                value="1"
                sx={{ padding: 0 }}
                onClick={() => {
                  dispatch(getAllProjectsDeactive(''));
                  dispatch(GetQuantityProjects());
                }}
              >
                <QuantityButton>{`Deactive Projects (${quantityDeactiveProjects?.quantity})`}</QuantityButton>
              </MenuItem>
              <MenuItem value="2" sx={{ padding: 0 }}>
                <QuantityButton
                  onClick={() => {
                    dispatch(getAllProjects(''));
                    dispatch(GetQuantityProjects());
                  }}
                >
                  {`All Projects (${
                    quantityActiveProjects && quantityDeactiveProjects
                      ? quantityActiveProjects?.quantity + quantityDeactiveProjects?.quantity
                      : ''
                  })`}
                </QuantityButton>
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
              label="Search by client or project name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              sx={{ width: '100%' }}
            />
          </Grid>
        </Grid>
      </Box>
      {(loadingAllProjects || loadingAllProjectsActive || loadingAllProjectsDeactive || loadingQuantityProjects) && (
        <ClipLoader color="#f44336" size={45} />
      )}
      {!loadingAllProjects && !loadingAllProjectsActive && !loadingAllProjectsDeactive && !loadingQuantityProjects && (
        <Box sx={{ padding: '20px', color: '#555' }}>
          {arrangeProjects &&
            arrangeProjects.map((project, index) => (
              <Box sx={{ width: '100%', mb: '20px' }} key={index}>
                <Typography
                  sx={{
                    backgroundColor: '#d3d3d3',
                    padding: '10px',
                    borderRadius: '5px',
                    textAlign: 'left',
                    fontSize: '18px',
                    fontWeight: '700',
                  }}
                >
                  {project.customerName}
                </Typography>
                {project.data.map((item, index) => (
                  <SingleProject
                    key={index}
                    nameProject={item.name}
                    developers={item.pms}
                    allMembers={item.activeMember}
                    projectType={item.projectType}
                    timeStart={item.timeStart}
                    timeEnd={item.timeEnd}
                    status={item.status}
                  />
                ))}
              </Box>
            ))}
        </Box>
      )}
    </Wrapper>
  );
}

export default Project;
