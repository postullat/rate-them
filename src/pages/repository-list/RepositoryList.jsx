import React, {useEffect, useState} from "react";
import './RepositoryList.css';
import Pagination from "react-js-pagination";
/*import 'bootstrap/dist/css/bootstrap.css';*/
import SearchInput, {createFilter} from 'react-search-input'
import MainMenu from "../../components/main-menu/main-menu";
import ReviewApi from "../../api/ReviewApi";

let RepositoryList = () => {

    const KEYS_TO_FILTERS = ['name', 'description', 'owner.login', 'owner.repos_url']

    const [repositories, setRepositories] = useState([]);
    const [filteredEmails, setFilteredEmails] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [itemsCountPerPage, setitemsCountPerPage] = useState(5);
    const [totalItemsCount, setTotalItemsCount] = useState(0);
    const [pageRangeDisplayed, setPageRangeDisplayed] = useState(3);
    const [sliceFrom, setSliceFrom] = useState(0);
    const [sliceTo, setSliceTo] = useState(5);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);


    useEffect(() => {

        /*RepositoryListApi().then(response => {
            setRepositories(response.data)
            setFilteredEmails(response.data)
            setTotalItemsCount(response.data.length);
            setIsLoaded(true);
        })
            .catch(error => {
                console.log('Error loading data from git url: '+error)
                setIsLoaded(true);
                setIsError(true)
            });*/

        ReviewApi().getLastAddedReviews({page: sliceFrom, amount: sliceTo})
            .then((res) => {
                setRepositories(res.data.reviews)
                setFilteredEmails(res.data.reviews)
                setTotalItemsCount(res.data.totalItems);
                setIsLoaded(true);
                console.log('Saved success!')
            })
            .catch(error => {
                setIsLoaded(true);
                setIsError(true)
                console.log('Error loading data from git url: '+error);
            });

        console.log("repositories: " + repositories);

    }, []);

    let handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
        setSliceFrom((pageNumber - 1) * itemsCountPerPage)
        setSliceTo((pageNumber - 1) * itemsCountPerPage /*sliceFrom*/ + itemsCountPerPage)
        //debugger
        console.log('Page change');
    }

    let searchUpdated = (term) => {
        //filter
        term = term === undefined ? '' : term
        const filtered = repositories.filter(createFilter(term, KEYS_TO_FILTERS));
        setFilteredEmails(filtered);

        //set pagination indexes
        setTotalItemsCount(filtered.length);
        setActivePage(1);
        setSliceFrom(0)
        setSliceTo(5)
    }

    let formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    //owner profile picture on the first column, then owner name, repo name, repo url, and description

    return (
        <>
            <MainMenu/>
                <span>
                    <SearchInput className="search-input" onChange={searchUpdated}/>

                    <table className='table'>
                        <thead className='table-header'>
                        <tr>
                            <th>#</th>
                            <th>HR</th>
                            <th>Interviewer</th>
                            <th>Date</th>
                            <th>Company</th>
                            <th>Rating</th>
                            <th>Vacancy</th>

                        </tr>
                        </thead>
                        <tbody>
                         {filteredEmails.slice(sliceFrom, sliceTo).map((el, i) => {
                             return (
                                 <tr key={i}>
                                     <td className='table-num-col'>{sliceFrom + i + 1}</td>
                                     <td>{el.hr.name}</td>
                                     <td>{el.tech.interviewerName}</td>
                                     <td>{formatDate(el.startDate)}</td>
                                     <td>{el.companyName}</td>
                                     <td>{el.hr.iceBrake}</td>
                                     {/*<td>{el.owner.repos_url}</td>*/}
                                     <td className='table-desc-col'>{el.vacancyName}</td>
                                 </tr>
                             )
                         })}
                        </tbody>
                    </table>

                    {!isLoaded ? <h3>Loading...</h3> :
                             isError ? <h3 style={{color: 'red'}}>Error fetching the data...</h3> :

                                 filteredEmails === undefined || filteredEmails.length === 0 ?
                                     <h3>Results not found</h3> : ''}

                    <Pagination
                        activePage={activePage}
                        itemsCountPerPage={itemsCountPerPage}
                        totalItemsCount={totalItemsCount}
                        pageRangeDisplayed={pageRangeDisplayed}
                        onChange={handlePageChange}
                    />

                </span>


        </>
    )
}

export default RepositoryList;