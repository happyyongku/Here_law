import "./MagazineHotfixCard.css";

function MagazineHotfixCard({ item }) {
  // console.log(item[1]);

  return (
    <div className="magazine-hotfix-card-container">
      <div className="magazine-hotfix-card-head-box">
        <div className="magazine-hotfix-card-title">{item[0]}</div>
        <div className="design-box"></div>
      </div>
      <hr />
      <div className="magazine-hotfix-content-box">
        {item[1].map((item, index) => (
          <div key={index} className="magazine-hotfix-content-box-title">
            {/* <div>-------------------------</div> */}
            <div className="law-name">{item.law_name}</div>
            <div>
              {item.diff.map((item2, index) => (
                <div key={index} className="mini-box">
                  {Object.entries(item2).map((item3, index) => (
                    <div key={index} className="just-mini-box">
                      {/* <div>========</div> */}
                      <div>
                        {item3[0] === "old" ? (
                          <div className="rowjdwjs">개정 전</div>
                        ) : (
                          <div className="rowjdgn">개정 후</div>
                        )}
                      </div>
                      <div>
                        {item3[1].map((item4, index) => (
                          <div key={index} className="mini-mini-box">
                            <div className="just-text-title">{item4.index}</div>
                            <div className="magazine-hotfix-content-box-content">
                              {item4.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* <div>{item[1][0].law_name}</div> */}
      {/* {something.map((item, index) => (
        <div className="magazine-hotfix-content-box" key={index}>
          <div className="magazine-hotfix-content-box-title">
            증거 수집 방식 강화
          </div>
          <div className="magazine-hotfix-content-box-content">
            새로운 조항이 추가되어, 경찰이 범죄 현장에서 증거를 수집할 때 특정
            절차를 준수해야 함. 제123조, 제7항 새로운 조항이 추가되어, 경찰이
            범죄 현장에서 증거를 수집할 때 특정 절차를 준수해야 함. 제123조,
            제7항
          </div>
        </div>
      ))} */}
    </div>
  );
}

export default MagazineHotfixCard;
