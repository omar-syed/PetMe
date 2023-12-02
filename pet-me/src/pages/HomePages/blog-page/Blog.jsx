import Post from "../../../components/home/Post";
import { axiosInstance } from '../../../api/config';
import { useState, useEffect } from "react";
import PageContext from '../../../Context/PageContext';
import Paginator from '../../../components/Paginator/Paginator'
import CreateBlog from '../../../components/Blog/CreateBlog'
import { useSelector } from "react-redux";
import PostContext from "../../../Context/PostContext";


const Blog = () => {
    const {synced, currentUser} = useSelector(state => state.currentUser)
    const [ postsList , setPostsList ] = useState([])
    const [ page , setPage ] = useState(1)
    const [ maxpages, setmaxpages ] = useState(1)

    const getPostsList = () => {
        axiosInstance.get(`/posts/?page=${page}`)
        .then((res) => {
            setPostsList(res.data.results)
            setmaxpages(res.data.total_pages)
        })
        .catch((err) => console.log(err));
    }

    useEffect(()=>{
        getPostsList()
    },[page])

    return ( 
        <section style={{backgroundColor:'#eee'}}>
            <div class="container posts py-5">
                { synced && (
                    <div className="d-flex justify-content-center mb-3">
                        <PostContext.Provider value={{ postsList, setPostsList }}>
                            <CreateBlog user={currentUser}/>
                        </PostContext.Provider>
                    </div>
                )}

                <div class="row d-flex justify-content-center">
                    <div class="col-md-12 col-lg-10 col-xl-8">
                    <PostContext.Provider value={{ postsList, setPostsList }}>
                        {postsList.map((post) => {
                            return (
                                <div key={post.id}>
                                    <Post post={post} />
                                </div>
                            );
                        })}
                    </PostContext.Provider>
                    </div>

                </div>
            </div>
            
            { maxpages > 1 ? <div className="paginator">
                <PageContext.Provider  value={{page,setPage}}>
                    <Paginator maxpages={maxpages}/>
                </PageContext.Provider>
            </div> : <></> }
        </section>
    );
}
 
export default Blog;