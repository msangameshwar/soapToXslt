const { render } = require('ejs');
const fs = require('fs');
const xml2js = require('xml2js');

exports.soapToJson = async function (inputText, basePath) {
  try {
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(inputText);
    // Extract the root object
    const rootKey = Object.keys(result);
    const jsonObj = result[rootKey];
    //return JSON.stringify(jsonWithoutRoot, null, 2);

    let finalOp = `<!-- Stylesheet to inject namespaces into a document in specific places -->

    <xsl:template match="node()">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*" />
        </xsl:copy>
    </xsl:template>

    <!-- template to copy attributes -->
    <xsl:template match="@*">
        <xsl:attribute name="{local-name()}">
            <xsl:value-of select="." />
        </xsl:attribute>
    </xsl:template>
    
        <!-- Start -->
        
    `;

    function processDict(obj, path = '') {
      for (let key in obj) {
        const divide = key.split(':');
        const part1 = divide[0];
        const part2 = divide[1];
        //console.log('part1:', part1);
        //console.log('part2:', part2);

        ///soapenv:Envelope/soapenv:Body/tns:CreateNewProposal
        finalOp += `  <xsl:template match="${basePath}${path}/tns:${part2}">
        <xsl:element name="${part1}:{local-name()}">
          <xsl:apply-templates select="node()|@*"/>
        </xsl:element>
      </xsl:template>
    
      `;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          processDict(obj[key], `${path}/tns:${key}`);
        }
      }
    }
    processDict(jsonObj);

    finalOp += `     <!-- End -->

    <!-- template to copy the rest of the nodes -->
    <xsl:template match="comment() | processing-instruction()">
        <xsl:copy />
    </xsl:template>`;

    return finalOp;
  } catch (err) {
    console.error('Error parsing the XML:', err);
    throw err; // Optionally, rethrow the error to handle it upstream
  }
};
