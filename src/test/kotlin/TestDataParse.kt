import com.alibaba.fastjson.JSON
import com.alibaba.fastjson.JSONObject
import com.alibaba.fastjson.serializer.SerializerFeature
import org.apache.commons.lang3.StringUtils
import org.junit.jupiter.api.Test
import java.io.File

class TestDataParse {
    @Test
    fun testParse() {
        var devSetArray = JSON.parseArray(File("hotpot_dev_distractor_v1.json").readText())
        val predictJson = JSON.parseObject(File("pred.json").readText())

        val answerObj = predictJson.getJSONObject("answer")
        val supporting = predictJson.getJSONObject("sp")
        val typeProb = predictJson.getJSONObject("type_prob")
        val typePredict = predictJson.getJSONObject("type")

        val list = ArrayList<JSONObject>()

        var emCountForNum = 0
        var emCountForTotal = 0

        for (i in 0 until devSetArray.size) {
            val jsonObject = devSetArray.getJSONObject(i)
            val id = jsonObject["_id"].toString()

            val predicted = answerObj[id].toString().trim()
            val providedAnswer = jsonObject["answer"].toString().trim()

            val jaroWinklerDistance = StringUtils.getJaroWinklerDistance(predicted, providedAnswer)
            jsonObject["similarity"] = jaroWinklerDistance
            jsonObject["answer_prediction"] = predicted
            jsonObject["supporting_facts_in_prediction"] = supporting[id]

            jsonObject["type_prob"] = typeProb[id]

            val typePred = typePredict.getIntValue(id)
            jsonObject["type_prediction"] = typePred

            val question = jsonObject["question"].toString()

            if (predicted == providedAnswer) {
                emCountForTotal++
            }

            if (containsNumber(question) || containsNumber(providedAnswer)) {
                list.add(jsonObject)
                if (predicted == providedAnswer) {
                    emCountForNum++
                }
            }
        }

        println("Question/Answer with number EM/Total: $emCountForNum/${list.size} ${1f * emCountForNum / list.size}")
        println("Question/Answer with number Wrong/Total: ${list.size - emCountForNum}/${list.size} ${1f * (list.size - emCountForNum) / list.size}")
        val noNumber = devSetArray.size - list.size
        val noNumberEM = emCountForTotal - emCountForNum
        println("Question&Answer without number EM/Total: $noNumberEM/$noNumber ${1f * noNumberEM / noNumber}")
        println("Question&Answer without number Wrong/Total: ${noNumber - noNumberEM}/$noNumber ${1f * (noNumber - noNumberEM) / noNumber}")


        val output = File("number.json")
        output.writeText(JSON.toJSONString(list, SerializerFeature.PrettyFormat))

    }

    fun containsNumber(question: String): Boolean {
        return question.contains(Regex("\\d+"))
                || question.contains(Regex("first|second|third|forth|fifth"))
    }
}