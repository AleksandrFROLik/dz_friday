import {memo, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";

import {
    changeNumberPageCardsAC,
    getPackItemTC,
    setCardsCountAC,
    setMaxMinGradeAC
} from "bll/reducers/packItem-reducer";

import {setActiveModalCardAC} from "bll/reducers/modalCard-reducer";
import {addNewCardTC, deleteCardTC, sortCardsType, updateCardTC} from "bll/reducers/myCard-reducer";
import {useAppSelector} from "bll/store";
import {
    selectorCardId,
    selectorCards, selectorFetching,
    selectorMaxGrade,
    selectorMinGrade,
    selectorMyUserId,
    selectorPackItem, selectorPage, selectorPageCount, selectorQuestion
} from 'bll/selectors/selectors';

import s from "../PacksListPage/PacksListPage.module.scss";

import Card from './Card/Card';
import TablePackItem from './TablePackItem/TablePackItem';

import MyModalPageCard from "./ModalsPageForCards/MyModalPageCard";
import SuperButton from "../../common/c2-SuperButton/SuperButton";
import SuperDoubleRange from "../../common/SuperComponents/SuperDoubleRange";
import SuperSelect from "../../common/SuperComponents/SuperSelect";
import Paginator from "../../common/Paginator/Paginator";
import {useDebounce} from "hooks/useDebounce";
import Search from "../PacksListPage/Search/SearchInput";
import {useInput} from "hooks/useInput";
import Preloader from "ui/common/Preloader/Preloader";


const PackItem = memo(() => {

    const arrayNumbers = [4, 5, 6, 7, 8, 9, 10]
    const isFetching = useAppSelector(selectorFetching)
    const packItem = useAppSelector(selectorPackItem)
    const minGrade = useAppSelector(selectorMinGrade)
    const maxGrade = useAppSelector(selectorMaxGrade)
    const cards = useAppSelector(selectorCards)
    const pageCount = useAppSelector(selectorPageCount)
    const page = useAppSelector(selectorPage)
    const myUserId = useAppSelector(selectorMyUserId)
    const question = useAppSelector(selectorQuestion)
    const cardId = useAppSelector(selectorCardId)



    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {id} = useParams()

    const [sortCards, setSortCards] = useState<sortCardsType>('')

    const search = useInput('', [])

    const searchDebounce = useDebounce(search.value, 1500)
    const minGradeDebounce = useDebounce(minGrade, 1000)
    const maxGradeDebounce = useDebounce(maxGrade, 1000)

    const NO_CARDS = cards.length === 0
    const MAX_RANGE_COUNT = 6
    const MIN_RANGE_COUNT = 0
    const START_PAGE = 1
    const START_CARDS_COUNT = 4

    useEffect(() => {
        dispatch(getPackItemTC(id,
            page,
            pageCount,
            minGrade,
            maxGrade,
            String(searchDebounce),
            String(searchDebounce),
            sortCards))

    }, [page, pageCount, minGradeDebounce, maxGradeDebounce, searchDebounce, sortCards, dispatch, id, question, minGrade,
        maxGrade,])


    const setValuesOnSlider = (value: number[]) => {
        dispatch(setMaxMinGradeAC(value[0], value[1]))
    };

    const setCardCount = (cardsCount: number) => {
        dispatch(setCardsCountAC(cardsCount))
        dispatch(changeNumberPageCardsAC(1))
    };

    const changeNumberPage = (num: number) => {
        dispatch(changeNumberPageCardsAC(num))
    };

    const addNewCard = (question: string, answer: string) => {
        dispatch(addNewCardTC(id, question, answer))
    };

    const deleteCard = () => {
        dispatch(deleteCardTC(id, cardId))
    };

    const updateCard = (cardId: string, newQuestion: string, newAnswer: string) => {
        dispatch(updateCardTC(id, newQuestion, newAnswer, cardId))
    };

    const handleBackToPackList = () => {
        dispatch(setMaxMinGradeAC(MIN_RANGE_COUNT, MAX_RANGE_COUNT))
        dispatch(setCardsCountAC(START_CARDS_COUNT))
        dispatch(changeNumberPageCardsAC(START_PAGE))
        navigate('/packsList')
    };


    return (
        <>

            <div className={s.packsListPageContainer}>
                <div className={s.leftBlock}>
                    <SuperButton className={s.doubleButton}
                                 onClick={handleBackToPackList}>
                        Back to Pack List
                    </SuperButton>
                    {myUserId === packItem.packUserId &&
                    <SuperButton className={s.doubleButton}
                                 onClick={() => dispatch(setActiveModalCardAC('addPack'))}>
                        Add New Card
                    </SuperButton>}

                    <section className={s.show_packs_cards}>
                        <h6>Grade of cards</h6>
                        <div className={s.superRange_span_block}>
                            <span className={s.span}>{minGrade}</span>
                            <div className={s.superRange}>
                                <SuperDoubleRange
                                    onChangeRange={setValuesOnSlider}
                                    value={[minGrade, maxGrade]}
                                    min={minGrade}
                                    max={MAX_RANGE_COUNT}
                                />
                            </div>
                            <span className={s.span}>{maxGrade}</span>
                        </div>
                    </section>
                </div>

                <div className={s.rightBlock}>
                    <h1>Cards</h1>
                    <section>{isFetching && <Preloader/>}</section>
                    <Search searchOnChange={search.valueChange} searchValue={search.value}/>
                    <section className={s.table}>
                        <TablePackItem sortCards={sortCards} setSortCards={setSortCards}/>
                        {NO_CARDS && <h1>Not found cards</h1>}
                        {!NO_CARDS && cards.map(p => <Card key={p._id}
                                                           id={p._id}
                                                           answer={p.answer}
                                                           userId={p.user_id}
                                                           question={p.question}
                                                           updated={p.updated}
                                                           create={p.created}
                                                           grade={p.grade}/>)}
                    </section>

                    <SuperSelect options={arrayNumbers}
                                 value={pageCount}
                                 onChangeOption={(pageCount) => setCardCount(Number(pageCount))}
                    />

                    <Paginator totalCount={packItem.cardsTotalCount}
                               pageSize={pageCount}
                               currentPage={page}
                               changeNumberPage={(num) => changeNumberPage(num)}
                               portionSize={10}
                    />
                </div>
            </div>
            <MyModalPageCard addNewCard={addNewCard} deleteCard={deleteCard} updateCard={updateCard}/>
        </>
    );
});

export default PackItem;