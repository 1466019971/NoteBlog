package me.wuwenbin.noteblog.v3.web.frontend;

import me.wuwenbin.modules.jpa.support.Page;
import me.wuwenbin.modules.utils.http.R;
import me.wuwenbin.modules.utils.web.Controllers;
import me.wuwenbin.noteblog.v3.model.Article;
import me.wuwenbin.noteblog.v3.model.XParam;
import me.wuwenbin.noteblog.v3.model.frontend.bo.CommentListBo;
import me.wuwenbin.noteblog.v3.model.frontend.vo.CommentVo;
import me.wuwenbin.noteblog.v3.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toMap;

/**
 * created by Wuwenbin on 2018/2/6 at 14:28
 */
@Controller
@RequestMapping("/article")
public class ArticleController {

    @Autowired
    private ParamRepository paramRepository;
    @Autowired
    private CateRepository cateRepository;
    @Autowired
    private ArticleRepository articleRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TagRepository tagRepository;
    @Autowired
    private CommentRepository commentRepository;

    @GetMapping("/{id}")
    public String index(Model model, @PathVariable("id") Long id, Page<CommentVo> commentVoPage, CommentListBo commentListBo) {
        List<XParam> xParams = paramRepository.findAll();
        Map<String, Object> settings = xParams.stream()
                .filter(xParam -> !xParam.getName().equals("app_id") && !xParam.getName().equals("app_key"))
                .collect(toMap(XParam::getName, XParam::getValue));
        Article article = articleRepository.findOne(id);
        model.addAttribute("settings", settings);
        model.addAttribute("cateList", cateRepository.findAll());
        model.addAttribute("article", article);
        model.addAttribute("tags", tagRepository.findArticleTags(article.getId(), true));
        model.addAttribute("author", userRepository.findNicknameById(article.getAuthorId()));
        model.addAttribute("articles", articleRepository.findSimilarArticles(article.getCateId(), 10));
        model.addAttribute("similars", articleRepository.findSimilarArticles(article.getCateId(), 6));
        model.addAttribute("comments", commentRepository.findPagination(commentVoPage, CommentVo.class, commentListBo));
        return "frontend/article";
    }

    @PostMapping("/comments")
    @ResponseBody
    public Page<CommentVo> comments(Page<CommentVo> commentVoPage, CommentListBo commentListBo) {
        return commentRepository.findPagination(commentVoPage, CommentVo.class, commentListBo);
    }

    @PostMapping("/approve")
    @ResponseBody
    public R approve(@RequestParam Long articleId) {
        return Controllers.builder("点赞").exec(() -> articleRepository.updateApproveCntById(articleId) == 1);
    }
}
