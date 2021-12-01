import "./App.css";
import { createUseStyles } from "react-jss";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { debounce } from "./util/debounce.tsx";

const PAGE_SIZE = 10;

const useStyles = createUseStyles({
  App: {
    textAlign: "center",
    paddingTop: "150px",
  },
  Input: {
    height: "30px",
    width: "200px",
  },
  ButtonSubmit: {
    height: "30px",
    width: "100px",
  },
  NoResult: {
    marginTop: "60px",
  },
});

function App() {
  const classes = useStyles();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(0);
  const [queryArgsKeyword, setQueryArgsKeyword] = useState("");
  const [keyword, setKeyword] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const hasMoreRef = useRef(hasMore);

  const onSubmit = (e) => {
    console.log("submit");
    e.preventDefault();
    setPage(1);
    setQueryArgsKeyword(keyword);
		setHasMore(true);
  };

  useEffect(() => {
    if (page < 1) {
    } else {
      const getList = ({ keyword, pageSize = PAGE_SIZE, page = 1 }) => {
        setLoading(true);
        axios
          .get("http://douyin.bytedance.com/api/list", {
            keyword,
            pageSize,
            page,
          })
          .then((res) => {
            setLoading(false);
            const { total, list : newList } = res;
            if (page === 1) {
              setList(newList);
            } else {
              setList((prevList) => [...prevList, ...newList]);
            }
            setTotal(total);
            if (newList.length < PAGE_SIZE) {
              setHasMore(false);
            }
          })
          .catch(() => {
            setLoading(false);

            //  some test code here ----------- start

            // let list = new Array(10).fill('').map((i,idx)=>({title:`${page}-${idx}`,content: idx.toString().repeat(30)}))
            // if (page === 1) {
            //   setList(list);
            // } else {
            //   setList((prevList) => [...prevList, ...list]);
            // }

            //  some test code here ------------ end
          })
          .finally(() => {
            setHasSearched(true);
          });
      };

      getList({ keyword: queryArgsKeyword, pageSize: PAGE_SIZE, page });
    }
    return () => {};
  }, [page, queryArgsKeyword]);

  // 滑到底部加载更多 --------------- 开始
  useEffect(() => {
    const handleScroll = debounce(() => {
      console.log("scroll handleScroll", hasMoreRef);

      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      ) {
        console.log("not end");
      } else {
        console.log("scrolling down");
        if (hasMoreRef.current) {
          setPage((previousPageIndex) => 1 + previousPageIndex);
        }
      }
    }, 300);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      handleScroll.clear();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMoreRef]);

  // 滑到底部加载更多 --------------- 结束


  useEffect(() => {
    if(total<= list.length){
      setHasMore(false);
    }
    
  }, [list.length, total])

  return (
    <div className={classes.App}>
      <form onSubmit={onSubmit}>
        <input
          className={classes.Input}
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
        />
        <button
          disabled={loading}
          className={classes.ButtonSubmit}
          type="submit"
        >
          {loading ? "正在" : ""}搜索
        </button>
        {list.map((listItem) => (
          <ListItemInfo key={listItem.title} listItem={listItem} />
        ))}
        {!loading && hasSearched && list.length === 0 && (
          <div className={classes.NoResult}>查无结果</div>
        )}
      </form>
    </div>
  );
}

const ListItemInfo = ({ listItem }) => (
  <div>
    <h3>{listItem.title}</h3>
    <p>{listItem.content}</p>
  </div>
);

export default App;
