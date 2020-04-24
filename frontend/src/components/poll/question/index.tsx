import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import dracula from 'react-syntax-highlighter/dist/esm/styles/hljs/darcula';

import "./styles.scss";



const example: string = 
`1:    #include <iostream>
2:    
3:    using std::cin;
4:    using std::cout;
5:    using std::endl;
6:    
7:    
8:    
9:    template <typename T>
10:   void swap (const T &x, const T &y) {
11:     T temp = x;
12:     x = y;
13:     y = temp;
14:   }
15:   
16:   
17:   template <typename T>
18:   void print (const vector<T> &vec) {
19:     for (const T &el : vec) {
20:       cout << el << endl;
21:     }
22:   }
23:  
24:  
25:   int main () {
26:     int x, y;
27:     cin >> x >> y;
28:     swap(x, y);
29:     cout << x << ", " << y << endl;
30: 
31:     vector<size_t> vec = {1, 2, 3};
32:     print(vec);
33:
34:     return 0;
35:   }
36:   
`;

export interface QuestionProps {

}

export class Question extends React.Component<QuestionProps> {
  render (): JSX.Element {
    return (
      <div className = "pollQuestion">
        <div className="pollQuestionProblemHeader">
          <h1>Hello World error</h1>
        </div>
        <div className="pollQuestionProblem">
          <div className = "pollQuestionProblemText">
            &emsp;&emsp;Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem ullam blanditiis, quod saepe velit voluptate itaque nobis hic aliquid. Facilis, ipsa placeat natus, odit non perspiciatis earum ducimus rerum optio unde nisi ullam amet architecto dolorum maiores. Dolorum quod suscipit, earum odit eveniet sit fugit, vel libero esse modi mollitia est deleniti fuga illum? Ullam tempore, id nesciunt cum atque excepturi harum, dolor sequi eius modi, aliquid suscipit commodi officiis voluptatibus obcaecati aspernatur. Deserunt sint animi neque quasi similique fugit. Ut deserunt quaerat quas voluptate soluta temporibus optio illo perspiciatis rem officiis, eaque nobis blanditiis eius quos vitae recusandae sint.
          </div>
          <div className = "pollQuestionProblemCode">
            <SyntaxHighlighter language = 'cpp' style = {dracula}>
              {example}
            </SyntaxHighlighter>
          </div>
          <div className = "pollQuestionProblemText">
            &emsp;&emsp;;Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet ipsam labore est aliquam eius reprehenderit modi delectus minus cupiditate cumque?
          </div>
        </div>
        <div className="pollQuestionAnswer">

        </div>
      </div>
    );
  }
}
