/*
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import fileDownload from 'js-file-download';
import converter from 'graphql-to-postman';

// eslint-disable-next-line no-restricted-globals
self.onmessage = function (event) {
    console.log('Inside worker function');
    converter.convert({
        type: 'string',
        data: event.data[0],
    }, {}, (error, result) => {
        console.log('Inside worker result section');
        if (error) {
            console.log(error);
        } else {
            console.log('Inside worker else success function');
            const urlValue = event.data[1].https;
            console.log('url value :' + urlValue);
            const results = result;
            results.output[0].data.variable[0].value = urlValue;
            const outputData = results.output[0].data;
            console.log('output data :' + JSON.stringify(outputData));
            fileDownload(
                JSON.stringify(outputData),
                'postman collection',
            );
            console.log('Conversion success');
        }
    });
    console.log('Came out');
    // eslint-disable-next-line no-restricted-globals
    self.postMessage('Conversion Performed : ' + JSON.stringify(event.data[1]));
};
